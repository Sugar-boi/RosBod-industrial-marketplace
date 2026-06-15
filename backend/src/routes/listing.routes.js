const authMiddleware = require("../middleware/auth.middleware");
const prisma = require("../lib/prisma");
const allowRoles = require("../middleware/role.middleware");
const express = require("express");

const router = express.Router();

const {
    createListing,
    getListings,
    getListingById,
} = require("../controllers/listing.controller");

router.post(
    "/",
    authMiddleware,
    allowRoles("ADMIN", "SELLER"),
    // async (req, res, next) => {
    //     if (req.user.role === "SELLER" && !req.user.isApproved) {
    //         return res.status(403).json({ message: "Seller not approved" });
    //     }
    //     next();
    // },
    createListing
);
router.put(
    "/:id/approve",
    authMiddleware,
    allowRoles("ADMIN"),
    async (req, res) => {
        const listingId = Number(req.params.id);

        const updated = await prisma.listing.update({
            where: { id: listingId },
           data: {
    isApproved: true,
    status: "APPROVED",
}
        });
        res.json(updated);
    }
);

router.put(
    "/:id/reject",
    authMiddleware,
    allowRoles("ADMIN"),
    async (req, res) => {
        const listingId = Number(req.params.id);

        await prisma.listing.delete({
            where: {
                id: listingId,
            },
        });

        res.json({
            message: "Listing rejected",
        });
    }
);

router.get("/", getListings);

router.get("/:id", getListingById);

module.exports = router;