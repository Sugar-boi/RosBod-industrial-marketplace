const prisma = require("../lib/prisma");

const getNotifications = async (req, res) => {
    try {
        console.log(
            "NOTIFICATION USER:",
            req.user
        );
        const notifications =
            await prisma.notification.findMany({
                where: {
                    userId: req.user.userId,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

        res.json(notifications);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const markAsRead = async (req, res) => {
    try {
        const notificationId = Number(
            req.params.id
        );

        const notification =
            await prisma.notification.update({
                where: {
                    id: notificationId,
                },
                data: {
                    isRead: true,
                },
            });

        res.json(notification);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const getUnreadCount = async (req, res) => {
    try {
        const count =
            await prisma.notification.count({
                where: {
                    userId: req.user.userId,
                    isRead: false,
                },
            });

        res.json({ count });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    getUnreadCount,
};