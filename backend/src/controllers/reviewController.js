const prisma = require("../lib/prisma");
const formatReview = (review) => {
  if (!review) return review;

  const {
    user_review_buyerIdTouser,
    ...rest
  } = review;

  return {
    ...rest,
    buyer: user_review_buyerIdTouser,
  };
};

const createReview = async (req, res) => {
  try {
    const buyerId = req.user.userId;

    const {
      listingId,
      rating,
      comment,
    } = req.body;

    const listing = await prisma.listing.findUnique({
      where: {
        id: Number(listingId),
      },
      select: {
        id: true,
        sellerId: true,
      },
    });

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }
    if (listing.sellerId === buyerId) {
      return res.status(400).json({
        message: "You cannot review your own listing.",
      });
    }

    console.log(req.user);
    console.log("buyerId:", buyerId);

    const existingReview = await prisma.review.findUnique({
      where: {
        buyerId_listingId: {
          buyerId,
          listingId: listing.id,
        },
      },
    });
    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this listing.",
      });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        buyerId,
        sellerId: listing.sellerId,
        listingId: listing.id,
      },
    });

    res.status(201).json(review);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getListingReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        listingId: Number(req.params.id),
      },
      include: {
        user_review_buyerIdTouser: {
          select: {
            name: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(reviews.map(formatReview));
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getSellerReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        sellerId: Number(req.params.id),
      },
      include: {
        user_review_buyerIdTouser: {
          select: {
            name: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(reviews.map(formatReview));
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createReview,
  getSellerReviews,
  getListingReviews,
};