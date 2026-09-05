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
  | "AUCTIONS";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [activeTab, setActiveTab] =
    useState<Tab>("ALL");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(
      fetchNotifications,
      9000
    );

    return () =>
      clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token =
        localStorage.getItem("token");

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
        // window.dispatchEvent(new Event("notificationsUpdated"));
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
  
      const res = await fetch(
        `${API_BASE_URL}/api/notifications/${id}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!res.ok) {
        throw new Error("Failed to mark as read");
      }
  
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
  
      // updates Navbar + sidebar badge without refresh
      window.dispatchEvent(new Event("notificationsUpdated"));
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    const unread =
      notifications.filter(
        (notification) =>
          !notification.isRead
      );

    await Promise.all(
      unread.map((notification) =>
        markAsRead(
          notification.id
        )
      )
    );
  };

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;

  const getCategory = (
    notification: Notification
  ) => {
    if (
      notification.type ===
      "LISTING_APPROVED" ||
      notification.type ===
      "LISTING_REJECTED" ||
      notification.listingId ||
      notification.message
        .toLowerCase()
        .includes(
          "awaiting approval"
        )
    ) {
      return "LISTINGS";
    }

    if (
      notification.auctionId ||
      notification.type === "NEW_BID" ||
      notification.type === "OUTBID" ||
      notification.type ===
      "AUCTION_WON" ||
      notification.type ===
      "AUCTION_ENDED"
    ) {
      return "AUCTIONS";
    }

    return "LISTINGS";
  };

  const filteredNotifications =
    useMemo(() => {
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
          getCategory(
            notification
          ) === activeTab
      );
    }, [
      notifications,
      activeTab,
    ]);

  const getTitle = (
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
        return "Outbid";

      case "AUCTION_WON":
        return "Auction Won";

      case "AUCTION_ENDED":
        return "Auction Ended";

      case "NO_BIDS":
        return "Auction Ended";

      default:
        if (
          notification.message
            .toLowerCase()
            .includes(
              "awaiting approval"
            )
        ) {
          return "New Listing Awaiting Approval";
        }

        return "Notification";
    }
  };

  const getHref = (
    notification: Notification
  ) => {
    /*
     * Admin listing-submission notifications
     * currently do not contain listingId/type.
     *
     * So we send the admin to the pending
     * listings screen rather than pretending
     * it is an auction.
     */

    if (
      notification.message
        .toLowerCase()
        .includes(
          "awaiting approval"
        )
    ) {
      return "/admin/pending-listings";
    }

    if (notification.listingId) {
      return `/admin/listings`;
    }

    if (notification.auctionId) {
      return `/admin/auctions`;
    }

    return null;
  };

  const getAction = (
    notification: Notification
  ) => {
    if (
      notification.message
        .toLowerCase()
        .includes(
          "awaiting approval"
        )
    ) {
      return "Review listing →";
    }

    if (notification.listingId) {
      return "View listing →";
    }

    if (notification.auctionId) {
      return "View auction →";
    }

    return null;
  };

  const formatTime = (
    date: string
  ) => {
    const created =
      new Date(date);

    const now = new Date();

    const diff =
      now.getTime() -
      created.getTime();

    const minutes = Math.floor(
      diff / 60000
    );

    const hours = Math.floor(
      diff / 3600000
    );

    const days = Math.floor(
      diff / 86400000
    );

    if (minutes < 1)
      return "Just now";

    if (minutes < 60)
      return `${minutes} min${minutes === 1
        ? ""
        : "s"
        } ago`;

    if (hours < 24)
      return `${hours} hr${hours === 1
        ? ""
        : "s"
        } ago`;

    if (days === 1)
      return "Yesterday";

    if (days < 7)
      return `${days} days ago`;

    return created.toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
      }
    );
  };

  return (
    <div className="max-w-5xl mx-auto">

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
            onClick={
              markAllAsRead
            }
            className="text-sm text-gray-600 hover:text-orange-500"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

        {/* TABS */}
        <div className="flex border-b border-gray-200">

          {[
            ["ALL", "All"],
            ["UNREAD", "Unread"],
            [
              "LISTINGS",
              "Listings",
            ],
            [
              "AUCTIONS",
              "Auctions",
            ],
          ].map(
            ([value, label]) => (
              <button
                key={value}
                onClick={() =>
                  setActiveTab(
                    value as Tab
                  )
                }
                className={`px-5 py-4 text-sm font-medium border-b-2 ${activeTab ===
                  value
                  ? "border-orange-500 text-gray-900"
                  : "border-transparent text-gray-500"
                  }`}
              >
                {label}
              </button>
            )
          )}
        </div>

        {/* LIST */}
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading notifications...
          </div>
        ) : filteredNotifications.length ===
          0 ? (
          <div className="p-12 text-center">
            <p className="font-medium">
              No notifications
            </p>
          </div>
        ) : (
          filteredNotifications.map(
            (notification) => {
              const href =
                getHref(
                  notification
                );

              const action =
                getAction(
                  notification
                );

              return (
                <div
                  key={
                    notification.id
                  }
                  className={`flex gap-4 p-5 border-b border-gray-100 ${!notification.isRead
                    ? "bg-orange-50/50"
                    : "bg-white"
                    }`}
                >

                  {/* ICON */}
                  <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-500 flex items-center justify-center flex-shrink-0">
                    !
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1">

                    <div className="flex justify-between gap-4">

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {getTitle(
                            notification
                          )}
                        </h3>

                        <p className="text-sm text-gray-600 mt-1">
                          {
                            notification.message
                          }
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
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
                            className="text-xs text-gray-500 hover:text-orange-500 mt-2
                            border border-gray-300 
                            text-white
                            bg-blue-500 px-2 py-1 rounded 
                          transition
                           hover:text-orange-500"
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
                          className="inline-block mt-3 text-sm font-medium text-orange-500 hover:text-orange-600"
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
  );
}