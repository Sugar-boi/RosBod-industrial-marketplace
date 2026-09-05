const express = require("express");

const router = express.Router();

const {
    getHomeStats,
} = require("../controllers/home.controller");

router.get("/stats", getHomeStats);

module.exports = router;