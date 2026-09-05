// const prisma = require("../lib/prisma");

// const settleExpiredAuctions = async () => {
//     try {
//         const expiredAuctions =
//             await prisma.auction.findMany({
//                 where: {
//                     endDate: {
//                         lt: new Date(),
//                     },
//                     status: "LIVE",
//                 },
//                 include: {
//                     listing: true,
//                     bid: {
//                         orderBy: {
//                             amount: "desc",
//                         },
//                         take: 1,
//                     },
//                 },
//             });

//         for (const auction of expiredAuctions) {
//             const winningBid = auction.bid[0];

//             await prisma.auction.update({
//                 where: {
//                     id: auction.id,
//                 },
//                 data: {
//                     status: winningBid
//                         ? "SOLD"
//                         : "ENDED",
//                     winnerId: winningBid
//                         ? winningBid.userId
//                         : null,
//                     currentBid: winningBid
//                         ? winningBid.amount
//                         : auction.currentBid,
//                 },
//             });

//             if (!winningBid) {
//                 await prisma.notification.create({
//                     data: {
//                         userId:
//                             auction.listing.sellerId,
//                         listingId:
//                             auction.listing.id,
//                         auctionId:
//                             auction.id,
//                         type: "NO_BIDS",
//                         message:
//                             `Your auction "${auction.listing.title}" ended without receiving any bids.`,
//                     },
//                 });

//                 continue;
//             }

//             await prisma.listing.update({
//                 where: {
//                     id: auction.listing.id,
//                 },
//                 data: {
//                     isSold: true,
//                     soldAt: new Date(),
//                 },
//             });

//             await prisma.notification.create({
//                 data: {
//                     userId:
//                         winningBid.userId,
//                     listingId:
//                         auction.listing.id,
//                     auctionId:
//                         auction.id,
//                     type: "AUCTION_WON",
//                     message:
//                         `Congratulations! You won the auction for "${auction.listing.title}".`,
//                 },
//             });

//             await prisma.notification.create({
//                 data: {
//                     userId:
//                         auction.listing.sellerId,
//                     listingId:
//                         auction.listing.id,
//                     auctionId:
//                         auction.id,
//                     type: "AUCTION_ENDED",
//                     message:
//                         `Your auction "${auction.listing.title}" has ended.`,
//                 },
//             });
//         }

//         if (expiredAuctions.length > 0) {
//             console.log(
//                 `Processed ${expiredAuctions.length} expired auction(s)`
//             );
//         }
//     } catch (error) {
//         console.error(
//             "Auction Settlement Error:",
//             error
//         );
//     }
// };

// module.exports = settleExpiredAuctions;

const prisma = require("../lib/prisma");

const settleExpiredAuctions = async () => {
    try {
        const now = new Date();

        // ============================================
        // 1. SCHEDULED → LIVE when startDate is reached
        // ============================================
        const toGoLive = await prisma.auction.updateMany({
            where: {
                status: "SCHEDULED",
                startDate: {
                    lte: now,
                },
            },
            data: {
                status: "LIVE",
                updatedAt: now,
            },
        });

        if (toGoLive.count > 0) {
            console.log(`Moved ${toGoLive.count} auction(s) from SCHEDULED → LIVE`);
        }

        // ============================================
        // 2. LIVE → ENDED / SOLD when endDate is reached
        // ============================================
        const expiredAuctions = await prisma.auction.findMany({
            where: {
                endDate: {
                    lt: now,
                },
                status: "LIVE",
            },
            include: {
                listing: true,
                bid: {
                    orderBy: {
                        amount: "desc",
                    },
                    take: 1,
                },
            },
        });

        for (const auction of expiredAuctions) {
            const winningBid = auction.bid[0];

            await prisma.auction.update({
                where: {
                    id: auction.id,
                },
                data: {
                    status: winningBid ? "SOLD" : "ENDED",
                    winnerId: winningBid ? winningBid.userId : null,
                    currentBid: winningBid
                        ? winningBid.amount
                        : auction.currentBid,
                    updatedAt: now,
                },
            });

            if (!winningBid) {
                await prisma.notification.create({
                    data: {
                        userId: auction.listing.sellerId,
                        listingId: auction.listing.id,
                        auctionId: auction.id,
                        type: "NO_BIDS",
                        message: `Your auction "${auction.listing.title}" ended without receiving any bids.`,
                    },
                });
                continue;
            }

            // Mark listing as sold
            await prisma.listing.update({
                where: {
                    id: auction.listing.id,
                },
                data: {
                    isSold: true,
                    soldAt: now,
                },
            });

            // Notify winner
            await prisma.notification.create({
                data: {
                    userId: winningBid.userId,
                    listingId: auction.listing.id,
                    auctionId: auction.id,
                    type: "AUCTION_WON",
                    message: `Congratulations! You won the auction for "${auction.listing.title}".`,
                },
            });

            // Notify seller
            await prisma.notification.create({
                data: {
                    userId: auction.listing.sellerId,
                    listingId: auction.listing.id,
                    auctionId: auction.id,
                    type: "AUCTION_ENDED",
                    message: `Your auction "${auction.listing.title}" has ended.`,
                },
            });
        }

        if (expiredAuctions.length > 0) {
            console.log(`Processed ${expiredAuctions.length} expired auction(s)`);
        }
    } catch (error) {
        console.error("Auction Settlement Error:", error);
    }
};

module.exports = settleExpiredAuctions;