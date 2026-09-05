const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");

const {
    getBuyerDashboard,
} = require("../controllers/buyer.controller");

router.get(
    "/dashboard",
    authMiddleware,
    allowRoles("BUYER"),
    getBuyerDashboard
);

module.exports = router;