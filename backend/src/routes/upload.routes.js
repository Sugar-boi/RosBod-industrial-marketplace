const express = require("express");

const upload = require(
    "../middleware/upload.middleware"
);

const authMiddleware = require(
    "../middleware/auth.middleware"
);

const allowRoles = require(
    "../middleware/role.middleware"
);

const {
    uploadImages,
} = require(
    "../controllers/upload.controller"
);

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    allowRoles("SELLER", "ADMIN"),
    upload.array("images", 10),
    uploadImages
);

module.exports = router;