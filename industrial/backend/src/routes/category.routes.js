const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/auth.middleware");

const allowRoles =
    require("../middleware/role.middleware");

const {
    getCategories,
    createCategory,
} = require("../controllers/category.controller");

router.get("/", getCategories);

router.post(
    "/",
    authMiddleware,
    allowRoles("ADMIN"),
    createCategory
);

module.exports = router;