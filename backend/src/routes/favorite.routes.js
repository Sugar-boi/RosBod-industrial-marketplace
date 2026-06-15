const express = require("express");

const router = express.Router();

const auth =
    require("../middleware/auth.middleware");

const {
    toggleFavorite,
    getMyFavorites,
} = require(
    "../controllers/favorite.controller"
);

router.post(
    "/:id",
    auth,
    toggleFavorite
);

router.get(
    "/my-favorites",
    auth,
    getMyFavorites
);

module.exports = router;