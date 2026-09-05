"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import API_BASE_URL from "@/lib/api-config";

type NotificationType =
    | "OUTBID"
    | "AUCTION_WON"
    | "NEW_BID"
    | "LISTING_APPROVED"
    | "LISTING_REJECTED"
    | "NO_BIDS"
    | "AUCTION_ENDED"
    | string;

interface Notification {
    id: number;
    userId: number;
    message: string;
    type?: NotificationType | null;
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
        status?: string;
    } | null;
}

type Filter =
    | "all"
    | "unread"
    | "bids"
    | "auctions";

function getNotificationTitle(
    notification: Notification
) {
    switch (notification.type) {
        case "OUTBID":
            return "You've Been Outbid";

        case "AUCTION_WON":
            return "Auction Won";

        case "NEW_BID":
            return "New Bid Received";

        case "LISTING_APPROVED":
            return "Listing Approved";

        case "LISTING_REJECTED":
            return "Listing Rejected";

        case "NO_BIDS":
            return "Auction Ended";

        case "AUCTION_ENDED":
            return "Auction Ended";

        default:
            return "Notification";
    }
}

function getNotificationCategory(
    notification: Notification
) {
    switch (notification.type) {
        case "OUTBID":
        case "NEW_BID":
            return "bids";

        case "AUCTION_WON":
        case "NO_BIDS":
        case "AUCTION_ENDED":
            return "auctions";

        default:
            return "all";
    }
}

function getNotificationIcon(
    notification: Notification
) {
    switch (notification.type) {
        case "OUTBID":
            return (
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M12 20V10" />
                    <path d="M18 20V4" />
                    <path d="M6 20v-6" />
                </svg>
            );

        case "AUCTION_WON":
            return (
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M8 21h8" />
                    <path d="M12 17v4" />
                    <path d="M7 4h10" />
                    <path d="M5 4v2a7 7 0 0 0 14 0V4" />
                    <path d="M3 4h2" />
                    <path d="M19 4h2" />
                </svg>
            );

        case "NEW_BID":
            return (
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="m14 6 4 4" />
                    <path d="M8 12 4 16" />
                    <path d="m12 8 4 4" />
                    <path d="m3 21 6-6" />
                    <path d="m14 10 7-7" />
                </svg>
            );

        default:
            return (
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
                </svg>
            );
    }
}

function getNotificationIconStyle(
    notification: Notification
) {
    switch (notification.type) {
        case "OUTBID":
            return "bg-orange-50 text-orange-500";

        case "AUCTION_WON":
            return "bg-green-50 text-green-600";

        case "NEW_BID":
            return "bg-blue-50 text-blue-600";

        default:
            return "bg-gray-100 text-gray-600";
    }
}

function getRelativeTime(
    dateString: string
) {
    const date = new Date(dateString);
    const now = new Date();

    const seconds = Math.floor(
        (now.getTime() - date.getTime()) / 1000
    );

    if (seconds < 60) {
        return "Just now";
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return `${minutes} ${minutes === 1 ? "min" : "mins"
            } ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours} ${hours === 1 ? "hr" : "hrs"
            } ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
        return `${days} ${days === 1 ? "day" : "days"
            } ago`;
    }

    return date.toLocaleDateString();
}

export default function NotificationsPage() {
    const [notifications, setNotifications] =
        useState<Notification[]>([]);

    const [activeFilter, setActiveFilter] =
        useState<Filter>("all");

    const [loading, setLoading] =
        useState(true);

    const fetchNotifications =
        useCallback(async () => {
            try {
                const token =
                    localStorage.getItem("token");

                if (!token) {
                    setLoading(false);
                    return;
                }

                const res = await fetch(
                    `${API_BASE_URL}/api/notifications`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error(
                        "Failed to fetch notifications"
                    );
                }

                const data = await res.json();

                setNotifications(
                    Array.isArray(data)
                        ? data
                        : []
                );
            } catch (error) {
                console.error(
                    "Notifications error:",
                    error
                );

                setNotifications([]);
            } finally {
                setLoading(false);
            }
        }, []);

    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(
            fetchNotifications,
            9000
        );

        return () =>
            clearInterval(interval);
    }, [fetchNotifications]);

    const unreadCount = useMemo(
        () =>
            notifications.filter(
                (notification) =>
                    !notification.isRead
            ).length,
        [notifications]
    );

    const filteredNotifications =
        useMemo(() => {
            return notifications.filter(
                (notification) => {
                    if (
                        activeFilter ===
                        "unread"
                    ) {
                        return !notification.isRead;
                    }

                    if (
                        activeFilter ===
                        "bids"
                    ) {
                        return (
                            notification.type ===
                            "OUTBID" ||
                            notification.type ===
                            "NEW_BID"
                        );
                    }

                    if (
                        activeFilter ===
                        "auctions"
                    ) {
                        return (
                            notification.type ===
                            "AUCTION_WON" ||
                            notification.type ===
                            "AUCTION_ENDED" ||
                            notification.type ===
                            "NO_BIDS"
                        );
                    }

                    return true;
                }
            );
        }, [
            notifications,
            activeFilter,
        ]);

    const markAsRead = async (
        id: number
    ) => {
        try {
            const token =
                localStorage.getItem("token");

            if (!token) return;

            await fetch(
                `${API_BASE_URL}/api/notifications/${id}/read`,
                {
                    method: "PUT",
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            setNotifications((current) =>
                current.map(
                    (notification) =>
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
        const unread =
            notifications.filter(
                (notification) =>
                    !notification.isRead
            );

        if (unread.length === 0) {
            return;
        }

        try {
            const token =
                localStorage.getItem("token");

            if (!token) return;

            await Promise.all(
                unread.map(
                    (notification) =>
                        fetch(
                            `${API_BASE_URL}/api/notifications/${notification.id}/read`,
                            {
                                method: "PUT",
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,
                                },
                            }
                        )
                )
            );

            setNotifications((current) =>
                current.map(
                    (notification) => ({
                        ...notification,
                        isRead: true,
                    })
                )
            );
        } catch (error) {
            console.error(
                "Failed to mark all notifications as read:",
                error
            );

            fetchNotifications();
        }
    };

    const getNotificationHref = (
        notification: Notification
    ) => {
        if (notification.auctionId) {
            return `/auctions/${notification.auctionId}`;
        }

        if (notification.listingId) {
            return `/listings/${notification.listingId}`;
        }

        return "/notifications";
    };

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <div className="mx-auto w-full max-w-[1000px] px-4 py-6 sm:px-6 lg:px-8">

                {/* HEADER */}
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-[26px] font-bold tracking-tight text-[#202020]">
                            Notifications
                        </h1>

                        <p className="mt-1 text-[14px] text-gray-500">
                            <span className="font-semibold text-[#333]">
                                {unreadCount}
                            </span>{" "}
                            unread{" "}
                            {unreadCount === 1
                                ? "notification"
                                : "notifications"}
                        </p>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="mt-1 text-[13px] font-medium text-gray-700 hover:text-black transition"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                {/* FILTERS */}
                <div className="border border-gray-200 bg-white rounded-t-xl">
                    <div className="flex items-center overflow-x-auto">

                        <button
                            onClick={() =>
                                setActiveFilter("all")
                            }
                            className={`relative shrink-0 px-5 py-4 text-[13px] font-medium transition ${activeFilter === "all"
                                ? "text-[#222]"
                                : "text-gray-500 hover:text-gray-800"
                                }`}
                        >
                            All

                            {activeFilter === "all" && (
                                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff9900]" />
                            )}
                        </button>

                        <button
                            onClick={() =>
                                setActiveFilter("unread")
                            }
                            className={`relative shrink-0 px-5 py-4 text-[13px] font-medium transition ${activeFilter === "unread"
                                ? "text-[#222]"
                                : "text-gray-500 hover:text-gray-800"
                                }`}
                        >
                            Unread

                            {activeFilter === "unread" && (
                                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff9900]" />
                            )}
                        </button>

                        <button
                            onClick={() =>
                                setActiveFilter("bids")
                            }
                            className={`relative shrink-0 px-5 py-4 text-[13px] font-medium transition ${activeFilter === "bids"
                                ? "text-[#222]"
                                : "text-gray-500 hover:text-gray-800"
                                }`}
                        >
                            Bids

                            {activeFilter === "bids" && (
                                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff9900]" />
                            )}
                        </button>

                        <button
                            onClick={() =>
                                setActiveFilter("auctions")
                            }
                            className={`relative shrink-0 px-5 py-4 text-[13px] font-medium transition ${activeFilter === "auctions"
                                ? "text-[#222]"
                                : "text-gray-500 hover:text-gray-800"
                                }`}
                        >
                            Auctions

                            {activeFilter === "auctions" && (
                                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff9900]" />
                            )}
                        </button>
                    </div>
                </div>

                {/* NOTIFICATIONS */}
                <div className="border-x border-b border-gray-200 bg-white rounded-b-xl overflow-hidden">

                    {loading ? (
                        <div className="p-10 text-center text-sm text-gray-500">
                            Loading notifications...
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                                    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
                                </svg>
                            </div>

                            <p className="font-medium text-gray-800">
                                No notifications
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                You're all caught up.
                            </p>
                        </div>
                    ) : (
                        filteredNotifications.map(
                            (notification) => {
                                const title =
                                    getNotificationTitle(
                                        notification
                                    );

                                const category =
                                    getNotificationCategory(
                                        notification
                                    );

                                const href =
                                    getNotificationHref(
                                        notification
                                    );

                                return (
                                    <Link
                                        key={
                                            notification.id
                                        }
                                        href={href}
                                        onClick={() => {
                                            if (
                                                !notification.isRead
                                            ) {
                                                markAsRead(
                                                    notification.id
                                                );
                                            }
                                        }}
                                        className={`group relative flex gap-3 border-b border-gray-100 px-4 py-4 transition last:border-b-0 sm:px-5 ${!notification.isRead
                                            ? "bg-[#fffaf3] hover:bg-[#fff6e8]"
                                            : "bg-white hover:bg-gray-50"
                                            }`}
                                    >
                                        {/* UNREAD DOT */}
                                        <div className="w-2 shrink-0 pt-2">
                                            {!notification.isRead && (
                                                <span className="block h-2 w-2 rounded-full bg-[#ff9900]" />
                                            )}
                                        </div>

                                        {/* ICON */}
                                        <div
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${getNotificationIconStyle(
                                                notification
                                            )}`}
                                        >
                                            {getNotificationIcon(
                                                notification
                                            )}
                                        </div>

                                        {/* CONTENT */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                                                <h3 className="text-[14px] font-semibold text-[#252525]">
                                                    {title}
                                                </h3>

                                                <span className="shrink-0 text-[12px] text-gray-500">
                                                    {getRelativeTime(
                                                        notification.createdAt
                                                    )}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-[13px] leading-5 text-gray-500">
                                                {
                                                    notification.message
                                                }
                                            </p>

                                            {notification.listing?.title && (
                                                <p className="mt-1 text-[12px] text-gray-400">
                                                    {
                                                        notification
                                                            .listing
                                                            .title
                                                    }
                                                </p>
                                            )}

                                            <div className="mt-2 flex items-center gap-3">
                                                <span className="text-[12px] font-medium text-gray-500 group-hover:text-[#e58a00] transition">
                                                    {category ===
                                                        "bids"
                                                        ? "View bid →"
                                                        : "View auction →"}
                                                </span>

                                                {!notification.isRead && (
                                                    <button
                                                        type="button"
                                                        onClick={(
                                                            event
                                                        ) => {
                                                            event.preventDefault();
                                                            event.stopPropagation();

                                                            markAsRead(
                                                                notification.id
                                                            );
                                                        }}
                                                        className="text-[12px] text-gray-400 hover:text-gray-700
                                                        border border-gray-300 
                                                                text-white
                                                                bg-blue-500 px-2 py-1 rounded transition
                                                                hover:text-orange-500
                                                        "

                                                    >
                                                        Mark read
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            }
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

// "use client";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import API_BASE_URL from "@/lib/api-config";

// export default function NotificationsPage() {
//     const [notifications, setNotifications] =
//         useState<any[]>([]);

//     useEffect(() => {
//         fetchNotifications();

//         const interval = setInterval(
//             fetchNotifications,
//             9000
//         );

//         return () => clearInterval(interval);
//     }, []);

//     const fetchNotifications = async () => {
//         const token =
//             localStorage.getItem("token");

//         const res = await fetch(
//             `${API_BASE_URL}/api/notifications`,
//             {
//                 headers: {
//                     Authorization:
//                         `Bearer ${token}`,
//                 },
//             }
//         );

//         const data = await res.json();

//         setNotifications(data);
//     };

//     const markAsRead = async (
//         id: number
//     ) => {
//         const token =
//             localStorage.getItem("token");

//         await fetch(
//             `${API_BASE_URL}/api/notifications/${id}/read`,
//             {
//                 method: "PUT",
//                 headers: {
//                     Authorization:
//                         `Bearer ${token}`,
//                 },
//             }
//         );

//         fetchNotifications();
//     };

//     return (
//         <div className="p-10">
//             <h1 className="text-3xl font-bold mb-6">
//                 Notifications
//             </h1>

//             {notifications.length === 0 ? (
//                 <p>No notifications</p>
//             ) : (
//                 Array.isArray(notifications) &&
//                 notifications.map((notification) => (
//                     <div
//                         key={notification.id}
//                         className={`border rounded-xl p-4 mb-4 ${notification.isRead
//                                 ? "bg-gray-100"
//                                 : "bg-yellow-50"
//                             }`}
//                     >
//                         <p>{notification.message}</p>

//                         <p className="text-sm text-gray-500 mt-2">
//                             {new Date(notification.createdAt).toLocaleString()}
//                         </p>

//                         {/* Listing notifications */}
//                         {notification.type === "LISTING_APPROVED" &&
//                             notification.listing && (
//                                 <Link
//                                     href={`/listings/${notification.listing.id}`}
//                                     onClick={() => markAsRead(notification.id)}
//                                     className="inline-block mt-3 text-blue-600 hover:underline"
//                                 >
//                                     View Listing →
//                                 </Link>
//                             )}

//                         {notification.type === "LISTING_REJECTED" &&
//                             notification.listing && (
//                                 <Link
//                                     href={`/listings/${notification.listing.id}`}
//                                     onClick={() => markAsRead(notification.id)}
//                                     className="inline-block mt-3 text-blue-600 hover:underline"
//                                 >
//                                     View Listing →
//                                 </Link>
//                             )}

//                         {/* New bid */}
//                         {notification.type === "NEW_BID" &&
//                             notification.listing && (
//                                 <Link
//                                     href={`/listings/${notification.listing.id}`}
//                                     onClick={() => markAsRead(notification.id)}
//                                     className="inline-block mt-3 text-blue-600 hover:underline"
//                                 >
//                                     View Listing →
//                                 </Link>
//                             )}

//                         {/* Outbid */}
//                         {notification.type === "OUTBID" &&
//                             notification.auctionId && (
//                                 <Link
//                                     href={`/auctions/${notification.auctionId}`}
//                                     onClick={() => markAsRead(notification.id)}
//                                     className="inline-block mt-3 text-blue-600 hover:underline"
//                                 >
//                                     View Auction →
//                                 </Link>
//                             )}

//                         {/* Auction won */}
//                         {notification.type === "AUCTION_WON" &&
//                             notification.auctionId && (
//                                 <Link
//                                     href={`/auctions/${notification.auctionId}`}
//                                     onClick={() => markAsRead(notification.id)}
//                                     className="inline-block mt-3 text-blue-600 hover:underline"
//                                 >
//                                     View Auction →
//                                 </Link>
//                             )}

//                         {/* Default button */}
//                         {!notification.isRead &&
//                             !notification.listing &&
//                             !notification.auctionId && (
//                                 <button
//                                     onClick={() => markAsRead(notification.id)}
//                                     className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
//                                 >
//                                     Mark as Read
//                                 </button>
//                             )}
//                     </div>
//                 ))
//             )}
//         </div>
//     );
// }