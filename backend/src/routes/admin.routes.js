const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");
const {
    getPendingSellers,
    approveSeller,
    getPendingListings,
    approveListing,
    getDashboardStats,
    getAllUsers,
    getAllSellers,
    getAllListings,
    getAllAuctions,
    getAllBids,
    rejectListing,
} = require("../controllers/admin.controller");

router.use(authMiddleware, allowRoles("ADMIN"));

router.get("/pending-sellers", getPendingSellers);
router.get("/pending-listings", getPendingListings);
router.put("/approve-seller/:id", approveSeller);
router.get("/dashboard-stats", getDashboardStats);
router.get("/users", getAllUsers);
router.put("/approve-listing/:id", approveListing);
router.get("/sellers", getAllSellers);
router.get("/listings", getAllListings);
router.get(
    "/auctions",
    getAllAuctions
);
router.get(
    "/bids",
    getAllBids
);
router.put(
    "/reject-listing/:id",
    authMiddleware,
    allowRoles("ADMIN"),
    rejectListing
);

module.exports = router;