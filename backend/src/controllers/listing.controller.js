const prisma = require("../lib/prisma");

const createListing = async (req, res) => {
    try {
        // fetch user from JWT
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
        });

        console.log("JWT USER ID:", req.user.userId);
        console.log("DB USER:", user);

        // prevent unapproved sellers from creating listings
        if (user.role === "SELLER" && !user.isApproved) {
            return res.status(403).json({
                message: "Seller not approved",
            });
        }

        const {
            title,
            description,
            price,
            images,
            categoryId,
            isAuction,
        } = req.body;

        console.log("REQ BODY:", req.body);
        console.log("CATEGORY ID:", categoryId);

        const listing = await prisma.listing.create({
            data: {
                title,
                description,
                price,
                sellerId: user.id,
                categoryId,
                isAuction,
                isApproved: false,

                images: {
                    create: images.map((url) => ({
                        imageUrl: url,
                    })),
                },
            },

            include: {
                images: true,
            },
        });

        if (isAuction) {
            await prisma.auction.create({
                data: {
                    listingId: listing.id,
                    startingBid: price,
                    currentBid: price,
                    endDate: new Date(
                        Date.now() + 7 * 24 * 60 * 60 * 1000
                    ),
                },
            });
        }

        res.status(201).json(listing);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};

const getMyListings = async (req, res) => {
    try {
        const listings = await prisma.listing.findMany({
            where: {
                sellerId: req.user.userId,
            },
            include: {
                category: true,
                images: true,
                auction: true,
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


const getListings = async (req, res) => {
    try {
        const {
            search,
            categoryId,
            sort,
        } = req.query;

        const where = {
            isApproved: true,
        };

        if (search) {
            where.title = {
                contains: search,
            };
        }

        if (categoryId) {
            where.categoryId =
                Number(categoryId);
        }
        let orderBy = {
            createdAt: "desc",
        };

        if (sort === "oldest") {
            orderBy = {
                createdAt: "asc",
            };
        }

        if (sort === "priceAsc") {
            orderBy = {
                price: "asc",
            };
        }

        if (sort === "priceDesc") {
            orderBy = {
                price: "desc",
            };
        }

        const listings = await prisma.listing.findMany({
                where,
                include: {
                    seller: true,
                    category: true,
                    images: true,
                },
                orderBy,
            });

        res.json(listings);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const getListingById = async (req, res) => {
    try {
        const listing = await prisma.listing.findUnique({
            where: {
                id: Number(req.params.id),
            },
            include: {
                seller: true,
                category: true,
                images: true,
                auction: {
                    include: {
                        bids: true,
                    },
                },
            },
        });

        if (!listing || !listing.isApproved) {
            return res.status(404).json({
                message: "Listing not found",
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


module.exports = {
    createListing,
    getListings,
    getListingById,
    getMyListings,
};