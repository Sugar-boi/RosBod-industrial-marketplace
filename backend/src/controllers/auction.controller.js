const prisma = require("../lib/prisma");

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
                    listing: true,
                }
            });

        if (!auction) {
            return res.status(404).json({
                message: "Auction not found",
            });
        }
        if (new Date() > auction.endDate) {
            return res.status(400).json({
                message: "Auction has ended",
            });
        }

        if (amount <= auction.currentBid) {
            return res.status(400).json({
                message:
                    "Bid must be higher than current bid",
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
                amount,
                auctionId,
                userId: bidderId,
            },
        });

        await prisma.auction.update({
            where: {
                id:auctionId,
            },
            data: {
                currentBid: amount,
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

module.exports = {
    placeBid,
};