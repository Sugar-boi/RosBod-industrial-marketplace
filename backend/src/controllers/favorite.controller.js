const prisma = require("../lib/prisma");

const toggleFavorite = async (req, res) => {
    try {
        const userId = req.user.userId;
        const listingId = Number(req.params.id);

        const existing =
            await prisma.favorite.findFirst({
                where: {
                    userId,
                    listingId,
                },
            });

        if (existing) {
            await prisma.favorite.delete({
                where: {
                    id: existing.id,
                },
            });

            return res.json({
                favorited: false,
            });
        }

        await prisma.favorite.create({
            data: {
                userId,
                listingId,
            },
        });

        res.json({
            favorited: true,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const getMyFavorites = async (req, res) => {
    try {
        const favorites = await prisma.favorite.findMany({
            where: {
                userId: req.user.userId,
            },

            include: {
                listing: {
                    include: {
                        listingimage: true,

                        category: {
                            include: {
                                category: true,
                            },
                        },

                        user: {
                            select: {
                                id: true,
                                name: true,
                                isApproved: true,
                            },
                        },

                        auction: true,
                    },
                },
            },

            orderBy: {
                createdAt: "desc",
            },
        });

        // Convert Prisma's current relation name
        // back to the name your frontend expects.
        const formattedFavorites = favorites.map((favorite) => ({
            ...favorite,

            listing: {
                ...favorite.listing,

                images: favorite.listing.listingimage,

                seller: favorite.listing.user,

                listingimage: undefined,
                user: undefined,
            },
        }));

        res.json(formattedFavorites);

    } catch (error) {
        console.error("GET MY FAVORITES ERROR:", error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const checkFavorite = async (req, res) => {
    try {
        const userId = req.user.userId;
        const listingId = Number(req.params.id);

        const existing = await prisma.favorite.findFirst({
            where: {
                userId,
                listingId,
            },
        });

        res.json({
            favorited: !!existing,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    toggleFavorite,
    getMyFavorites,
    checkFavorite,
};