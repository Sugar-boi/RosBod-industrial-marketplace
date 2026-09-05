const prisma = require("../lib/prisma");
const { sendMail } = require("../lib/mail");
const formatListing = (listing) => {
    if (!listing) return listing;

    const {
        user,
        listingimage,
        ...rest
    } = listing;

    return {
        ...rest,
        seller: user,
        images: listingimage || [],
    };
};

const formatAuction = (auction) => {
    if (!auction) return auction;

    const {
        bid,
        ...rest
    } = auction;

    return {
        ...rest,
        bids: bid || [],
    };
};

const getPendingSellers = async (
    req,
    res
) => {
    try {
        const sellers =
            await prisma.user.findMany({
                where: {
                    role: "SELLER",
                    isApproved: false,
                },
            });

        res.json(sellers);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const approveSeller = async (req, res) => {
    try {
        const sellerId = Number(req.params.id);

        const seller = await prisma.user.findUnique({
            where: { id: sellerId },
        });

        if (!seller) {
            return res.status(404).json({
                message: "Seller not found",
            });
        }

        await prisma.user.update({
            where: { id: sellerId },
            data: { isApproved: true },
        });

        try {
            await sendMail({
                to: seller.email,
                subject: "Your Rosebod seller account is approved",
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 480px;">
                    <h2>You're approved${seller.name ? `, ${seller.name}` : ""}!</h2>
                    <p>Your seller account on Rosebod has been approved.</p>
                    <p>You can now create listings and auctions.</p>
                    <p>
                      <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/login">
                        Sign in to get started
                      </a>
                    </p>
                  </div>
                `,
            });
        } catch (mailErr) {
            console.error("Failed to send seller approval email:", mailErr);
        }

        res.json({
            message: "Seller approved successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
const getPendingListings = async (req, res) => {
    try {
        const listings =
            await prisma.listing.findMany({

                where: {
                    OR: [
                        { status: "PENDING" },
                        { isApproved: false, status: { not: "REJECTED" } },
                    ],
                },
                include: {
                    auction: true,
                    user: true,
                    category: true,
                    listingimage: true,
                },
                orderBy: {
                    createdAt: "desc"
                }
            });

        res.json(listings.map(formatListing));
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users =
            await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    whatsapp: true,
                    companyName: true,
                    location: true,
                    about: true,
                    role: true,
                    isApproved: true,
                    createdAt: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

        res.json(users);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const approveListing = async (req, res) => {
    try {
        const listingId = Number(
            req.params.id
        );

        const listing =
            await prisma.listing.update({
                where: {
                    id: listingId,
                },
                data: {
                    isApproved: true,
                    status: "APPROVED",
                },
            });

        await prisma.notification.create({
            data: {
                userId: listing.sellerId,
                listingId: listing.id,
                message: `${listing.title} has been approved`,
                type: "LISTING_APPROVED",
            },
        });

        res.json({
            message:
                "Listing approved",
            listing,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();

        const totalSellers = await prisma.user.count({
            where: {
                role: "SELLER",
            },
        });

        const pendingSellers = await prisma.user.count({
            where: {
                role: "SELLER",
                isApproved: false,
            },
        });

        const totalListings = await prisma.listing.count();

        const approvedListings = await prisma.listing.count({
            where: {
                status: "APPROVED",
            },
        });

        const pendingListings = await prisma.listing.count({
            where: {
                status: "PENDING",
            },
        });

        const rejectedListings = await prisma.listing.count({
            where: {
                status: "REJECTED",
            },
        });

        const totalAuctions = await prisma.auction.count();

        const activeAuctions = await prisma.auction.count({
            where: {
                endDate: {
                    gt: new Date(),
                },
            },
        });

        const endedAuctions = await prisma.auction.count({
            where: {
                endDate: {
                    lt: new Date(),
                },
            },
        });

        const totalBids = await prisma.bid.count();

        res.json({
            totalUsers,
            totalSellers,
            pendingSellers,

            totalListings,
            approvedListings,
            pendingListings,
            rejectedListings,

            totalAuctions,
            activeAuctions,
            endedAuctions,

            totalBids,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const getAllSellers = async (req, res) => {
    try {
        const sellers =
            await prisma.user.findMany({
                where: {
                    role: "SELLER",
                },
                include: {
                    listing: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

        res.json(sellers);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

// const getAllListings = async (req, res) => {
//     try {
//         const listings =
//             await prisma.listing.findMany({
//                 where: {
//                     OR: [
//                         { status: "PENDING" },
//                         { isApproved: false, status: { not: "REJECTED" } },
//                     ],
//                 },
//                 include: {
//                     auction: true,
//                     user: true,
//                     category: true,
//                     listingimage: true,
//                 },
//                 orderBy: {
//                     createdAt: "desc",
//                 },
//             });

//         res.json(listings.map(formatListing));
//     } catch (error) {
//         console.error(error);

//         res.status(500).json({
//             message: "Server Error",
//         });
//     }
// };

const getAllListings = async (req, res) => {
    try {
        const listings = await prisma.listing.findMany({
            include: {
                user: true,
                category: true,
                listingimage: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json(listings.map(formatListing));
    } catch (error) {
        console.error("GET ALL LISTINGS ERROR:", error);
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
};
const getAllAuctions = async (
    req,
    res
) => {
    try {
        const auctions =
            await prisma.auction.findMany({
                include: {
                    listing: {
                        include: {
                            listingimage: true,
                            category: true,
                            user: true,
                        },
                    },
                    bid: true,
                },
                orderBy: {
                    endDate: "desc",
                },
            });

        res.json(auctions.map(formatAuction));
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message,
        });
    }
};

const getAllBids = async (
    req,
    res
) => {
    try {
        const bids =
            await prisma.bid.findMany({
                include: {
                    user: true,
                    auction: {
                        include: {
                            listing: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

        res.json(bids);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const rejectListing = async (req, res) => {
    try {
        const listingId = Number(req.params.id);

        const { rejectReason } = req.body;

        const listing =
            await prisma.listing.update({
                where: {
                    id: listingId,
                },
                data: {
                    status: "REJECTED",
                    rejectReason,
                    isApproved: false,
                },
            });
        await prisma.notification.create({
            data: {
                userId: listing.sellerId,
                listingId: listing.id,
                message: `${listing.title} was rejected. Reason: ${rejectReason}`,
                type: "LISTING_REJECTED",
            },
        });

        res.json({
            message: "Listing rejected",
            listing,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

module.exports = {
    getPendingSellers,
    approveSeller,
    getPendingListings,
    getDashboardStats,
    approveListing,
    getAllUsers,
    getAllSellers,
    getAllListings,
    getAllAuctions,
    getAllBids,
    rejectListing,
};