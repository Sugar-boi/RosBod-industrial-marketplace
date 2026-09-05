// const getBuyerDashboard = async (req, res) => {
//     try {
//         const userId = req.user.userId;

//         // 1. Saved listings (favorites)
//         const saved = await prisma.favorite.count({
//             where: {
//                 userId,
//             },
//         });

//         // 2. Active bids (auctions the user has bid on that are still LIVE)
//         const activeBids = await prisma.bid.groupBy({
//             by: ["auctionId"],
//             where: {
//                 userId,
//                 auction: {
//                     status: "LIVE",
//                 },
//             },
//         }).then((groups) => groups.length);

//         // 3. Won auctions
//         const wonAuctions = await prisma.auction.count({
//             where: {
//                 winnerId: userId,
//                 // status: "SOLD",
//             },
//         });

//         // 4. Unread notifications (already working)
//         const notifications = await prisma.notification.count({
//             where: {
//                 userId,
//                 isRead: false,
//             },
//         });

//         res.json({
//             saved,
//             activeBids,
//             wonAuctions,
//             notifications,
//         });
//     } catch (error) {
//         console.error("BUYER DASHBOARD ERROR:", error);
//         res.status(500).json({
//             message: "Server Error",
//         });
//     }
// };
// module.exports = {
//     getBuyerDashboard,
// };

const prisma = require("../lib/prisma");
const getBuyerDashboard = async (req, res) => {
    try {
        const userId = req.user.userId;

        console.log("===== BUYER DASHBOARD DEBUG =====");
        console.log("JWT userId:", userId, typeof userId);

        // All auctions that have a winner
        const allWon = await prisma.auction.findMany({
            where: {
                winnerId: { not: null },
            },
            select: {
                id: true,
                winnerId: true,
                status: true,
                listing: { select: { title: true } },
            },
        });
        console.log("All auctions with winner:", allWon);

        // Count with exact match
        const wonAuctions = await prisma.auction.count({
            where: {
                winnerId: userId,
            },
        });
        console.log("Count for this userId:", wonAuctions);

        // Also try with Number() just in case
        const wonAuctionsNum = await prisma.auction.count({
            where: {
                winnerId: Number(userId),
            },
        });
        console.log("Count with Number(userId):", wonAuctionsNum);

        const saved = await prisma.favorite.count({
            where: { userId },
        });

        const activeBids = await prisma.bid
            .groupBy({
                by: ["auctionId"],
                where: {
                    userId,
                    auction: { status: "LIVE" },
                },
            })
            .then((g) => g.length);

        const notifications = await prisma.notification.count({
            where: {
                userId,
                isRead: false,
            },
        });

        res.json({
            saved,
            activeBids,
            wonAuctions: wonAuctions || wonAuctionsNum,
            notifications,
            debug: {
                jwtUserId: userId,
                allWonAuctions: allWon,
            },
        });
    } catch (error) {
        console.error("BUYER DASHBOARD ERROR:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
module.exports = {
    getBuyerDashboard,
};