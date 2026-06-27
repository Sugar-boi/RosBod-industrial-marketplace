const express = require("express");

const router = express.Router();

const authMiddleware = require(
    "../middleware/auth.middleware"
);

const {
    getNotifications,
    markAsRead,
    getUnreadCount,
} = require(
    "../controllers/notification.controller"
);


console.log("authMiddleware:", authMiddleware);
console.log("getNotifications:", getNotifications);
console.log("markAsRead:", markAsRead);
console.log("getUnreadCount:", getUnreadCount);
router.use(authMiddleware);
router.get(
    "/unread-count",
    getUnreadCount
);

router.get(
    "/",
    authMiddleware,
    getNotifications
);

router.put(
    "/:id/read",
    authMiddleware,
    markAsRead
);

module.exports = router;