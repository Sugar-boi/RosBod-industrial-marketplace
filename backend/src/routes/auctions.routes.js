const express = require("express");

const router = express.Router();

const {
    createAuction,
    placeBid,
    getAuction,
    getAuctions,
} = require("../controllers/auction.controller");

const authMiddleware =
    require("../middleware/auth.middleware");

router.get(
    "/",
    getAuctions
);


// router.post(
//     "/",
//     authMiddleware,
//     createAuction
// );
router.post(
    "/",
    (req, res, next) => {
        console.log("========== AUCTION ROUTE HIT ==========");
        next();
    },
    authMiddleware,
    createAuction
);


router.get(
    "/:id",
    getAuction
);



router.post(
    "/:id/bid",
    authMiddleware,
    placeBid
);

module.exports = router;