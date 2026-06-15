const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");

const {
    getSellerStats,
    getMyListings,
    getMyListingById,
    getSellerProfile,
    deleteMyListing,
    updateMyListing,
    getMyProfile,
    updateMyProfile,
    getMyAuctions
} = require("../controllers/seller.controller");

router.get(
    "/dashboard-stats",
    authMiddleware,
    allowRoles("SELLER"),
    getSellerStats
);

router.get("/my-listings", authMiddleware, allowRoles("SELLER"), getMyListings);

router.get("/my-listings/:id", authMiddleware, allowRoles("SELLER"), getMyListingById);

router.get(
    "/profile",
    authMiddleware,
    allowRoles("SELLER"),
    getMyProfile
);


router.put(
    "/my-listings/:id",
    authMiddleware,
    allowRoles("SELLER"),
    updateMyListing
);

router.put(
    "/profile",
    authMiddleware,
    allowRoles("SELLER"),
    updateMyProfile
);
router.delete(
    "/my-listings/:id",
    authMiddleware,
    allowRoles("SELLER"),
    deleteMyListing
);

router.get(
    "/my-auctions",
    authMiddleware,
    allowRoles("SELLER"),
    getMyAuctions
);

router.get("/profile/:id", getSellerProfile);
module.exports = router;

