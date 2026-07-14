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
} = require("../controllers/listing.controller");

router.post(
    "/",
    authMiddleware,
    allowRoles("ADMIN", "SELLER"),
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

router.get("/", getListings);

router.get(
    "/:id",
    optionalAuth,
    getListingById
);



module.exports = router;