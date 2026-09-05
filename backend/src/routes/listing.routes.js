const authMiddleware = require("../middleware/auth.middleware");
const optionalAuth = require("../middleware/optionalAuth.middleware");
const prisma = require("../lib/prisma");
const allowRoles = require("../middleware/role.middleware");
const express = require("express");

const router = express.Router();

const {
    createListing,
    getListings,
    getListingById,
    getRelatedListings,
    markListingSold,
    getListingsByIds,
    getMyListings,
    recordListingView
} = require("../controllers/listing.controller");

router.post(
    "/",
    authMiddleware,
    allowRoles("ADMIN", "SELLER"),
    createListing
);

router.post(
    "/by-ids",
    getListingsByIds
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
    "/:id/sold",
    authMiddleware,
    markListingSold
);

router.put(
    "/:id/reject",
    authMiddleware,
    allowRoles("ADMIN"),
    async (req, res) => {
        const listingId = Number(req.params.id);

        const updated = await prisma.listing.update({
            where: {
                id: listingId,
            },
            data: {
                status: "REJECTED",
                isApproved: false,
            },
        });

        res.json(updated);
    }
);
router.post("/:id/view", recordListingView);

router.get("/", getListings);

router.get(
    "/my-listings",
    authMiddleware,
    getMyListings
);

router.get(
    "/:id/related",
    getRelatedListings
);

router.get(
    "/:id",
    optionalAuth,
    getListingById
);



module.exports = router;