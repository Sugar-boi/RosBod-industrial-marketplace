const prisma = require("../lib/prisma");
const formatAuction = (auction) => {
    if (!auction) return auction;

    // 1. Fix bids
    const bids = auction.bid || auction.bids || [];

    // 2. Fix listing
    let listing = auction.listing || null;
    if (listing) {
        listing = {
            ...listing,
            seller: listing.user || listing.seller || null,
            images: listing.listingimage || listing.images || [],
        };
        // remove Prisma names so frontend doesn't get confused
        delete listing.user;
        delete listing.listingimage;
    }

    return {
        ...auction,
        bid: undefined,
        bids,
        listing,
    };
};
const createAuction = async (req, res) => {
    console.log("========== CREATE AUCTION HIT ==========");
    console.log("BODY:", JSON.stringify(req.body, null, 2));
    console.log("USER:", req.user);

    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
        });

        console.log("JWT USER ID:", req.user.userId);
        console.log("DB USER:", user);

        // 1) not logged in / user missing
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        // 2) seller not approved yet
        if (user.role === "SELLER" && !user.isApproved) {
            return res.status(403).json({
                message:
                    "Your seller account is pending approval. You cannot create an auction yet.",
            });
        }
        const sellerId = req.user.userId;

        const {
            auctionMode,
            listingId,
            title,
            description,
            price,
            categoryId,
            images,
            startingBid,
            reservePrice,
            buyNowPrice,
            minimumIncrement,
            startDate,
            endDate,
            inspectionState,
            inspectionCity,
            inspectionAddress,
            inspectionDate,
            paymentTerms,
            terms,
        } = req.body;

        let listing = null;

        /*
        =========================
        EXISTING LISTING MODE
        =========================
        */
        if (auctionMode === "existing") {
            // 1) LOAD listing first
            listing = await prisma.listing.findUnique({
                where: {
                    id: Number(listingId),
                },
            });

            if (!listing) {
                return res.status(404).json({
                    message: "Listing not found",
                });
            }

            if (listing.sellerId !== sellerId) {
                return res.status(403).json({
                    message: "This listing doesn't belong to you.",
                });
            }

            if (listing.isAuction) {
                return res.status(400).json({
                    message: "This listing is already an auction.",
                });
            }
        }

        /*
        =========================
        NEW LISTING MODE
        =========================
        */
        if (auctionMode === "new") {
            if (!title || !description || !price || !categoryId) {
                return res.status(400).json({
                    message: "New listing details are incomplete.",
                });
            }

            listing = await prisma.listing.create({
                data: {
                    title,
                    description,
                    price: Number(price),
                    categoryId: Number(categoryId),
                    sellerId,
                    isAuction: true,
                    isApproved: false,
                    status: "PENDING",
                    listingimage: {
                        create: (images || []).map((imageUrl) => ({
                            imageUrl,
                        })),
                    },
                },
            });
        }

        if (!listing) {
            return res.status(400).json({
                message: "Invalid auction mode or listing data.",
            });
        }

        console.log("LISTING OK:", listing.id, listing.title);

        /*
        =========================
        CREATE AUCTION
        =========================
        */
        const auction = await prisma.auction.create({
            data: {
                listingId: listing.id,
                startingBid: Number(startingBid),
                currentBid: Number(startingBid),
                reservePrice: reservePrice ? Number(reservePrice) : null,
                buyNowPrice: buyNowPrice ? Number(buyNowPrice) : null,
                minimumIncrement: Number(minimumIncrement),
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                inspectionState,
                inspectionCity,
                inspectionAddress,
                inspectionDate: inspectionDate
                    ? new Date(inspectionDate)
                    : null,
                paymentTerms,
                terms,
                updatedAt: new Date(),
            },
        });

        /*
        =========================
        EXISTING → back to PENDING
        =========================
        */
        if (auctionMode === "existing") {
            await prisma.listing.update({
                where: {
                    id: listing.id,
                },
                data: {
                    isAuction: true,
                    status: "PENDING",
                    isApproved: false,
                    rejectReason: null,
                },
            });
        }

        res.status(201).json({
            message: "Auction submitted for admin approval.",
            auction,
        });
    } catch (error) {
        console.error("CREATE AUCTION ERROR:", error);
        console.error("ERROR MESSAGE:", error.message);
        console.error("ERROR CODE:", error.code);
        console.error("ERROR META:", error.meta);

        res.status(500).json({
            message: "Server Error",
            error: error.message,
            code: error.code || null,
        });
    }
};

const placeBid = async (req, res) => {
    try {
        const auctionId = Number(req.params.id);
        const { amount } = req.body;
        const bidderId = req.user.userId;

        const auction =
            await prisma.auction.findUnique({
                where: {
                    id: auctionId,
                },
                include: {
                    listing: {
                        include: {
                            listingimage: true,
                            user: true,
                            category: true,
                        },
                    },

                    bid: {
                        include: {
                            user: true,
                        },
                        orderBy: {
                            amount: "desc",
                        },
                    },
                }
            });

        if (!auction) {
            return res.status(404).json({
                message: "Auction not found",
            });
        }

        if (auction.listing.sellerId === bidderId) {
            return res.status(403).json({
                message: "You cannot bid on your own auction.",
            });
        }

        if (new Date() < auction.startDate) {
            return res.status(400).json({
                message: "Auction has not started yet.",
            });
        }

        if (new Date() > auction.endDate) {
            return res.status(400).json({
                message: "Auction has ended",
            });
        }
        if (auction.status !== "LIVE") {
            return res.status(400).json({
                message: "Auction is not currently live.",
            });
        }

        const bidAmount = Number(amount);

        const minimumAllowed =
            auction.currentBid +
            auction.minimumIncrement;

        if (bidAmount < minimumAllowed) {
            return res.status(400).json({
                message: `Minimum bid is ${minimumAllowed.toLocaleString()}`,
            });
        }

        const previousHighestBid = await prisma.bid.findFirst({
            where: {
                auctionId,
            },
            orderBy: {
                amount: "desc",
            },
        });

        const bid = await prisma.bid.create({
            data: {
                amount: bidAmount,
                auctionId,
                userId: bidderId,
            },
        });

        await prisma.auction.update({
            where: {
                id: auctionId,
            },
            data: {
                currentBid: bidAmount,
            },
        });

        await prisma.notification.create({
            data: {
                userId: auction.listing.sellerId,
                listingId: auction.listing.id,
                auctionId: auction.id,
                type: "NEW_BID",
                message: `A new bid has been placed on "${auction.listing.title}".`,
            },
        });

        if (
            previousHighestBid &&
            previousHighestBid.userId !== req.user.userId
        ) {
            await prisma.notification.create({
                data: {
                    userId: previousHighestBid.userId,
                    listingId: auction.listing.id,
                    auctionId: auction.id,
                    type: "OUTBID",
                    message: `You've been outbid on "${auction.listing.title}".`,
                },
            });
        }


        res.status(201).json(bid);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const getAuction = async (req, res) => {
    console.log("========== GET AUCTION HIT ==========", req.params.id);
    try {

        const auction = await prisma.auction.findUnique({

            where: {
                id: Number(req.params.id),
            },

            include: {
                listing: {
                    include: {
                        listingimage: true,
                        user: true,
                        category: true,
                    },
                },

                bid: {
                    include: {
                        user: true,
                    },
                    orderBy: {
                        amount: "desc",
                    },
                },
            }

        });

        if (!auction) {

            return res.status(404).json({
                message: "Auction not found",
            });

        }

        res.json(formatAuction(auction));

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Server Error",
        });

    }

};

const getAuctions = async (req, res) => {
    try {

        const auctions =
            await prisma.auction.findMany({
                where: {
                    listing: {
                        isApproved: true,
                        status: "APPROVED",
                    },
                },

                include: {
                    listing: {
                        include: {
                            listingimage: true,
                            category: true,
                            user: true,
                        },
                    },
                },

                orderBy: {
                    createdAt: "desc",
                },

            });

        res.json(auctions.map(formatAuction));

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Server Error",
        });

    }
};

module.exports = {
    createAuction,
    placeBid,
    getAuction,
    getAuctions,
};