const prisma = require("../lib/prisma");

const getHomeStats = async (req, res) => {
    try {
        const listings = await prisma.listing.count({
            where: {
                status: "APPROVED",
            },
        });

        const sellers = await prisma.user.count({
            where: {
                role: "SELLER",
                isApproved: true,
            },
        });

        const auctions = await prisma.auction.count({
            where: {
                endDate: {
                    gt: new Date(),
                },
            },
        });

        const categories = await prisma.category.count();

        res.json({
            listings,
            sellers,
            auctions,
            categories,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

module.exports = {
    getHomeStats,
};