const express = require("express");

const router = express.Router();

const {
    placeBid,
} = require("../controllers/auction.controller");

const authMiddleware =
    require("../middleware/auth.middleware");

router.post(
    "/:id/bid",
    authMiddleware,
    placeBid
);

module.exports = router;