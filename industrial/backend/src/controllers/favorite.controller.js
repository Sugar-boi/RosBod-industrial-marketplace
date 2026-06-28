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

const getMyFavorites = async (
    req,
    res
) => {
    try {
        const favorites =
            await prisma.favorite.findMany({
                where: {
                    userId:
                        req.user.userId,
                },
                include: {
                    listing: {
                        include: {
                            images: true,
                            category: true,
                        },
                    },
                },
            });

        res.json(favorites);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

module.exports = {
    toggleFavorite,
    getMyFavorites,
};