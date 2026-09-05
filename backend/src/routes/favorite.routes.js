const express = require("express");

const router = express.Router();

const auth =
    require("../middleware/auth.middleware");

const {
    toggleFavorite,
    getMyFavorites,
    checkFavorite,
} = require(
    "../controllers/favorite.controller"
);
router.get(
    "/my-favorites",
    auth,
    getMyFavorites
);

router.get(
    "/:id/check",
    auth,
    checkFavorite
);


router.post(
    "/:id",
    auth,
    toggleFavorite
);


module.exports = router;