const prisma = require("../lib/prisma");

const getSellerStats = async (
    req,
    res
) => {
    try {
        const sellerId =
            req.user.userId;

        const totalListings =
            await prisma.listing.count({
                where: {
                    sellerId,
                },
            });

        const pendingListings =
            await prisma.listing.count({
                where: {
                    sellerId,
                    isApproved: false,
                },
            });

        const auctions =
            await prisma.auction.count({
                where: {
                    listing: {
                        sellerId,
                    },
                },
            });

        res.json({
            totalListings,
            pendingListings,
            auctions,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};
const getMyListings = async (req, res) => {
    try {
        const listings =
            await prisma.listing.findMany({
                where: {
                    sellerId: req.user.userId,
                },
                include: {
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

const getMyListingById = async (
    req,
    res
) => {
    try {
        const listing =
            await prisma.listing.findFirst({
                where: {
                    id: Number(
                        req.params.id
                    ),
                    sellerId:
                        req.user.userId,
                },
                include: {
                    category: true,
                    images: true,
                    auction: true,
                },
            });

        if (!listing) {
            return res.status(404).json({
                message:
                    "Listing not found",
            });
        }

        res.json(listing);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};
const getSellerProfile = async (req, res
) => {
    try {
        const seller = await prisma.user.findUnique({
            where: {
                id: Number(req.params.id),
            },
            select: {
                id: true,
                name: true,
                companyName: true,
                location: true,
                phone: true,
                whatsapp: true,
                about: true,
                createdAt: true,

                listings: {
                    where: {
                        isApproved: true,
                    },
                    include: {
                        images: true,
                        category: true,
                    },
                },
            },
        });

        if (!seller) {
            return res.status(404).json({
                message: "Seller not found",
            });
        }

        res.json(seller);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const deleteMyListing = async (req, res) => {
    try {
        const listingId = Number(req.params.id);

        const listing =
            await prisma.listing.findUnique({
                where: {
                    id: listingId,
                },
            });

        if (!listing) {
            return res.status(404).json({
                message: "Listing not found",
            });
        }

        if (
            listing.sellerId !==
            req.user.userId
        ) {
            return res.status(403).json({
                message: "Unauthorized",
            });
        }

        await prisma.listingImage.deleteMany({
            where: {
                listingId,
            },
        });

        await prisma.favorite.deleteMany({
            where: {
                listingId,
            },
        });

        const auction =
            await prisma.auction.findUnique({
                where: {
                    listingId,
                },
            });

        if (auction) {
            await prisma.bid.deleteMany({
                where: {
                    auctionId: auction.id,
                },
            });

            await prisma.auction.delete({
                where: {
                    id: auction.id,
                },
            });
        }

        await prisma.listing.delete({
            where: {
                id: listingId,
            },
        });

        res.json({
            message:
                "Listing deleted successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const updateMyListing = async (req, res) => {
    try {
        const listingId = Number(req.params.id);

        const listing =
            await prisma.listing.findUnique({
                where: {
                    id: listingId,
                },
            });

        if (!listing) {
            return res.status(404).json({
                message: "Listing not found",
            });
        }

        if (
            listing.sellerId !==
            req.user.userId
        ) {
            return res.status(403).json({
                message: "Unauthorized",
            });
        }

        const {
            title,
            description,
            price,
            categoryId,
        } = req.body;

        const updatedListing =
            await prisma.listing.update({
                where: {
                    id: listingId,
                },
                data: {
                    title,
                    description,
                    price: Number(price),
                    categoryId:
                        Number(categoryId),
                },
            });

        res.json(updatedListing);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const getMyProfile = async (req, res) => {
    try {
        const seller =
            await prisma.user.findUnique({
                where: {
                    id: req.user.userId,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    whatsapp: true,
                    companyName: true,
                    location: true,
                    about: true,
                    createdAt: true,
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

const updateMyProfile = async (
    req,
    res
) => {
    try {
        const {
            name,
            phone,
            whatsapp,
            companyName,
            location,
            about,
        } = req.body;

        const user =
            await prisma.user.update({
                where: {
                    id: req.user.userId,
                },
                data: {
                    name,
                    phone,
                    whatsapp,
                    companyName,
                    location,
                    about,
                },
            });

        res.json(user);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const getMyAuctions = async (
    req,
    res
) => {
    try {
        const auctions =
            await prisma.auction.findMany({
                where: {
                    listing: {
                        sellerId:
                            req.user.userId,
                    },
                },
                include: {
                    listing: true,
                },
            });

        res.json(auctions);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message:
                "Server Error",
        });
    }
};

// const updateProfile = async (req, res) => {
//     try {
//         const sellerId = req.user.userId;

//         const {
//             companyName,
//             location,
//             about,
//             phone,
//             whatsapp,
//         } = req.body;

//         const updatedUser =
//             await prisma.user.update({
//                 where: {
//                     id: sellerId,
//                 },
//                 data: {
//                     companyName,
//                     location,
//                     about,
//                     phone,
//                     whatsapp,
//                 },
//             });

//         res.json(updatedUser);
//     } catch (error) {
//         console.error(error);

//         res.status(500).json({
//             message: "Server Error",
//         });
//     }
// };
module.exports = {
    getSellerStats,
    getMyListings,
    getMyListingById,
    getSellerProfile,
    getMyProfile,
    updateMyProfile,
    deleteMyListing,
    updateMyListing,
    getMyAuctions,
};