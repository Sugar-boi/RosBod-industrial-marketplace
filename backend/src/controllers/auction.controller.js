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

        const bid = await prisma.bid.create({
            data: {
                amount,
                auctionId,
                bidderId,
            },
        });

        await prisma.auction.update({
            where: {
                id: auctionId,
            },
            data: {
                currentBid: amount,
            },
        });

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