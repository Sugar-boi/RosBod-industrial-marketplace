"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import API_BASE_URL from "@/lib/api-config";

type Notification = {
    id: number;
    message: string;
    type?: string | null;
    listingId?: number | null;
    auctionId?: number | null;
    isRead: boolean;
    createdAt: string;
    listing?: {
        id: number;
        title?: string;
    } | null;
    auction?: {
        id: number;
    } | null;
};

type Tab =
    | "ALL"
    | "UNREAD"
    | "LISTINGS"
    | "AUCTIONS"
    | "REVIEWS";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [activeTab, setActiveTab] = useState<Tab>("ALL");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(
            fetchNotifications,
            9000
        );

        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `${API_BASE_URL}/api/notifications`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch notifications");
            }

            const data = await res.json();

            setNotifications(
                Array.isArray(data) ? data : []
            );
        } catch (error) {
            console.error(
                "Failed to fetch notifications:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: number) => {
        try {
            const token = localStorage.getItem("token");

            await fetch(
                `${API_BASE_URL}/api/notifications/${id}/read`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setNotifications((current) =>
                current.map((notification) =>
                    notification.id === id
                        ? {
                            ...notification,
                            isRead: true,
                        }
                        : notification
                )
            );
            window.dispatchEvent(new Event("notificationsUpdated"));

        } catch (error) {
            console.error(
                "Failed to mark notification as read:",
                error
            );
        }
    };

    const markAllAsRead = async () => {
        const unread = notifications.filter(
            (notification) => !notification.isRead
        );

        await Promise.all(
            unread.map((notification) =>
                markAsRead(notification.id)
            )
        );
    };

    const getNotificationCategory = (
        notification: Notification
    ) => {
        const type = notification.type;

        if (
            type === "LISTING_APPROVED" ||
            type === "LISTING_REJECTED"
        ) {
            return "LISTINGS";
        }

        if (
            type === "NEW_BID" ||
            type === "OUTBID" ||
            type === "AUCTION_WON" ||
            type === "AUCTION_ENDED" ||
            type === "NO_BIDS"
        ) {
            return "AUCTIONS";
        }

        if (
            type === "NEW_REVIEW" ||
            type === "REVIEW_RECEIVED"
        ) {
            return "REVIEWS";
        }

        return "ALL";
    };

    const filteredNotifications = useMemo(() => {
        if (activeTab === "ALL") {
            return notifications;
        }

        if (activeTab === "UNREAD") {
            return notifications.filter(
                (notification) =>
                    !notification.isRead
            );
        }

        return notifications.filter(
            (notification) =>
                getNotificationCategory(
                    notification
                ) === activeTab
        );
    }, [notifications, activeTab]);

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    const getNotificationTitle = (
        notification: Notification
    ) => {
        switch (notification.type) {
            case "LISTING_APPROVED":
                return "Listing Approved";

            case "LISTING_REJECTED":
                return "Listing Rejected";

            case "NEW_BID":
                return "New Bid Received";

            case "OUTBID":
                return "You've Been Outbid";

            case "AUCTION_WON":
                return "Auction Won";

            case "AUCTION_ENDED":
                return "Auction Ended";

            case "NO_BIDS":
                return "Auction Ended";

            default:
                return "Notification";
        }
    };

    const getNotificationIcon = (
        notification: Notification
    ) => {
        switch (notification.type) {
            case "LISTING_APPROVED":
                return "✓";

            case "LISTING_REJECTED":
                return "×";

            case "NEW_BID":
                return "⚒";

            case "OUTBID":
                return "⚠";

            case "AUCTION_WON":
                return "★";

            case "AUCTION_ENDED":
            case "NO_BIDS":
                return "◷";

            default:
                return "•";
        }
    };

    const getIconStyle = (
        notification: Notification
    ) => {
        switch (notification.type) {
            case "LISTING_APPROVED":
                return "bg-green-100 text-green-600";

            case "LISTING_REJECTED":
                return "bg-red-100 text-red-600";

            case "NEW_BID":
                return "bg-orange-100 text-orange-500";

            case "OUTBID":
                return "bg-yellow-100 text-yellow-600";

            case "AUCTION_WON":
                return "bg-blue-100 text-blue-600";

            case "AUCTION_ENDED":
            case "NO_BIDS":
                return "bg-purple-100 text-purple-600";

            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const getNotificationLink = (
        notification: Notification
    ) => {
        if (notification.auctionId) {
            return `/auctions/${notification.auctionId}`;
        }

        if (notification.listingId) {
            return `/listings/${notification.listingId}`;
        }

        return null;
    };

    const getActionText = (
        notification: Notification
    ) => {
        if (notification.auctionId) {
            return "View auction →";
        }

        if (notification.listingId) {
            return "View listing →";
        }

        return null;
    };

    const formatTime = (date: string) => {
        const created = new Date(date);
        const now = new Date();

        const diff =
            now.getTime() - created.getTime();

        const minutes = Math.floor(
            diff / 60000
        );

        const hours = Math.floor(
            diff / 3600000
        );

        const days = Math.floor(
            diff / 86400000
        );

        if (minutes < 1) {
            return "Just now";
        }

        if (minutes < 60) {
            return `${minutes} min${minutes === 1 ? "" : "s"
                } ago`;
        }

        if (hours < 24) {
            return `${hours} hr${hours === 1 ? "" : "s"
                } ago`;
        }

        if (days === 1) {
            return "Yesterday";
        }

        if (days < 7) {
            return `${days} days ago`;
        }

        return created.toLocaleDateString(
            undefined,
            {
                month: "short",
                day: "numeric",
            }
        );
    };

    return (
        <div className="min-h-screen bg-[#f8f8f6]">
            <div className="max-w-5xl mx-auto px-6 py-8">

                {/* HEADER */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Notifications
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            {unreadCount} unread
                            {unreadCount === 1
                                ? " notification"
                                : " notifications"}
                        </p>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-sm text-gray-700 hover:text-orange-500 transition"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                {/* TABS */}
                <div className="bg-white border border-gray-200 rounded-t-xl">
                    <div className="flex items-center border-b border-gray-200 overflow-x-auto">

                        {[
                            ["ALL", "All"],
                            ["UNREAD", "Unread"],
                            ["LISTINGS", "Listings"],
                            ["AUCTIONS", "Auctions"],
                            ["REVIEWS", "Reviews"],
                        ].map(([value, label]) => (
                            <button
                                key={value}
                                onClick={() =>
                                    setActiveTab(
                                        value as Tab
                                    )
                                }
                                className={`px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition ${activeTab === value
                                    ? "border-orange-500 text-gray-900"
                                    : "border-transparent text-gray-500 hover:text-gray-800"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* NOTIFICATIONS */}
                    <div>
                        {loading ? (
                            <div className="p-10 text-center text-gray-500">
                                Loading notifications...
                            </div>
                        ) : filteredNotifications.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="text-4xl mb-3">
                                    🔔
                                </div>

                                <p className="font-medium text-gray-900">
                                    No notifications
                                </p>

                                <p className="text-sm text-gray-500 mt-1">
                                    You&apos;re all caught up.
                                </p>
                            </div>
                        ) : (
                            filteredNotifications.map(
                                (notification) => {
                                    const href =
                                        getNotificationLink(
                                            notification
                                        );

                                    const action =
                                        getActionText(
                                            notification
                                        );

                                    return (
                                        <div
                                            key={
                                                notification.id
                                            }
                                            className={`relative flex gap-3 px-4 py-4 border-b border-gray-100 last:border-b-0 transition ${!notification.isRead
                                                ? "bg-orange-50/50"
                                                : "bg-white"
                                                }`}
                                        >
                                            {/* UNREAD DOT */}
                                            {!notification.isRead && (
                                                <div className="absolute left-3 top-7 w-2 h-2 rounded-full bg-orange-500" />
                                            )}

                                            {/* ICON */}
                                            <div
                                                className={`ml-4 flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${getIconStyle(
                                                    notification
                                                )}`}
                                            >
                                                {getNotificationIcon(
                                                    notification
                                                )}
                                            </div>

                                            {/* CONTENT */}
                                            <div className="flex-1 min-w-0">

                                                <div className="flex items-start justify-between gap-4">

                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 text-sm">
                                                            {getNotificationTitle(
                                                                notification
                                                            )}
                                                        </h3>

                                                        <p className="text-sm text-gray-600 mt-1 leading-5">
                                                            {
                                                                notification.message
                                                            }
                                                        </p>
                                                    </div>

                                                    <div className="flex-shrink-0 text-right">
                                                        <p className="text-xs text-gray-500">
                                                            {formatTime(
                                                                notification.createdAt
                                                            )}
                                                        </p>

                                                        {!notification.isRead && (
                                                            <button
                                                                onClick={() =>
                                                                    markAsRead(
                                                                        notification.id
                                                                    )
                                                                }
                                                                className="text-xs text-gray-500 border border-gray-300 
                                                                text-white
                                                                bg-blue-500 px-2 py-1 rounded transition
                                                                hover:text-orange-500 mt-2"
                                                            >
                                                                Mark read
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {href &&
                                                    action && (
                                                        <Link
                                                            href={
                                                                href
                                                            }
                                                            onClick={() =>
                                                                !notification.isRead &&
                                                                markAsRead(
                                                                    notification.id
                                                                )
                                                            }
                                                            className="inline-block mt-2 text-xs font-medium text-gray-700 hover:text-orange-500"
                                                        >
                                                            {
                                                                action
                                                            }
                                                        </Link>
                                                    )}
                                            </div>
                                        </div>
                                    );
                                }
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// "use client";

// import { useEffect, useState } from "react";
// import API_BASE_URL from "@/lib/api-config";

// export default function NotificationsPage() {
//     const [notifications, setNotifications] =
//         useState<any[]>([]);

//     useEffect(() => {
//         fetchNotifications();
//     }, []);

//     const fetchNotifications = async () => {
//         try {
//             const token =
//                 localStorage.getItem("token");

//             const res = await fetch(
//                 `${API_BASE_URL}/api/notifications`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             const data = await res.json();

//             setNotifications(data);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     return (
//         <div className="p-10">
//             <h1 className="text-3xl font-bold mb-6">
//                 Notifications
//             </h1>

//             {notifications.length === 0 ? (
//                 <p>No notifications</p>
//             ) : (
//                 <div className="space-y-4">
//                     {notifications.map(
//                         (notification) => (
//                             <div
//                                 key={notification.id}
//                                 className="border rounded-xl p-4"
//                             >
//                                 <p>
//                                     {notification.message}
//                                 </p>

//                                 <p className="text-sm text-gray-500 mt-2">
//                                     {new Date(
//                                         notification.createdAt
//                                     ).toLocaleString()}
//                                 </p>
//                             </div>
//                         )
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// }