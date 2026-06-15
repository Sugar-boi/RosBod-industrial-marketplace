const express = require("express");

const upload = require(
    "../middleware/upload.middleware"
);

const {
    uploadImages,
} = require(
    "../controllers/upload.controller"
);

const router = express.Router();

router.post(
    "/",
    upload.array("images", 10),
    uploadImages
);

module.exports = router;