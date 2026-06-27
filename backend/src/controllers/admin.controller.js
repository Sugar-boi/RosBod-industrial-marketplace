const prisma = require("../lib/prisma");

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

        const seller = await prisma.user.update({
            where: {
                id: sellerId,
            },
            data: {
                isApproved: true,
            },
        });

        res.json(seller);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};
const getPendingListings = async ( req, res ) => {
    try {
        const listings =
            await prisma.listing.findMany({
                where: {
                    status: "PENDING",
                    isApproved: false,
                },
                include: {
                    seller: true,
                    category: true,
                    images: true,
                },
                orderBy: {
                    createdAt: "desc"
                }
            });

        res.json(listings);
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

const approveListing = async ( req, res) => {
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
        // title: "Listing Approved",
        message: `${listing.title} has been approved`,
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
        const totalUsers =
            await prisma.user.count();

        const totalSellers =
            await prisma.user.count({
                where: {
                    role: "SELLER",
                },
            });

        const pendingSellers =
            await prisma.user.count({
                where: {
                    role: "SELLER",
                    isApproved: false,
                },
            });

        const pendingListings =
            await prisma.listing.count({
                where: {
                    isApproved: false,
                },
            });

        const totalListings =
            await prisma.listing.count();

        const totalAuctions =
            await prisma.auction.count();

        const totalBids =
            await prisma.bid.count();

        res.json({
            totalUsers,
            totalSellers,
            pendingSellers,
            pendingListings,
            totalListings,
            totalAuctions,
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
                    listings: true,
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

const getAllListings = async (req, res) => {
    try {
        const listings =
            await prisma.listing.findMany({
                include: {
                    seller: true,
                    category: true,
                    images: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

        res.json(listings);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
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
                    listing: true,
                    bids: true,
                },
                orderBy: {
                    endDate: "desc",
                },
            });

        res.json(auctions);
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
        // title: "Listing Rejected",
        message: `${listing.title} was rejected. Reason: ${rejectReason}`,
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