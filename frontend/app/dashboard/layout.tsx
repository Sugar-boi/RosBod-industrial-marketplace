"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import API_BASE_URL from "@/lib/api-config";


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}
) {
    const pathname = usePathname();

    const [user, setUser] = useState<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);


    useEffect(() => {
        const loadUser = () => {
            const storedUser =
                localStorage.getItem("user");

            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error(
                        "Failed to parse stored user:",
                        error
                    );
                }
            }
        };

        loadUser();
        window.addEventListener("authChanged", loadUser);
        return () => {
            window.removeEventListener(
                "authChanged",
                loadUser
            );
        };
    }, []);


    useEffect(() => {
        if (!user) return;

        const fetchUnread = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/notifications/unread-count`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) return;

                const data = await res.json();
                setUnreadCount(Number(data.count) || 0);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUnread();
        window.addEventListener("notificationsUpdated", fetchUnread);
        return () => {
            window.removeEventListener("notificationsUpdated", fetchUnread);
        };
    }, [user]);





    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f8f7f4]">
                <div className="text-sm text-gray-500">
                    Loading...
                </div>
            </div>
        );
    }

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const isActive = (href: string) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }

        return (
            pathname === href ||
            pathname.startsWith(`${href}/`)
        );
    };

    const NavIcon = ({
        type,
    }: {
        type:
        | "dashboard"
        | "listings"
        | "auction"
        | "create"
        | "saved"
        | "notifications"
        | "profile";
    }) => {
        if (type === "dashboard") {
            return (
                <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <rect
                        x="3"
                        y="3"
                        width="7"
                        height="7"
                        rx="1"
                    />
                    <rect
                        x="14"
                        y="3"
                        width="7"
                        height="7"
                        rx="1"
                    />
                    <rect
                        x="3"
                        y="14"
                        width="7"
                        height="7"
                        rx="1"
                    />
                    <rect
                        x="14"
                        y="14"
                        width="7"
                        height="7"
                        rx="1"
                    />
                </svg>
            );
        }

        if (type === "listings") {
            return (
                <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <line
                        x1="8"
                        y1="6"
                        x2="21"
                        y2="6"
                    />
                    <line
                        x1="8"
                        y1="12"
                        x2="21"
                        y2="12"
                    />
                    <line
                        x1="8"
                        y1="18"
                        x2="21"
                        y2="18"
                    />
                    <line
                        x1="3"
                        y1="6"
                        x2="3.01"
                        y2="6"
                    />
                    <line
                        x1="3"
                        y1="12"
                        x2="3.01"
                        y2="12"
                    />
                    <line
                        x1="3"
                        y1="18"
                        x2="3.01"
                        y2="18"
                    />
                </svg>
            );
        }

        if (type === "auction") {
            return (
                <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <path d="M14 4l6 6" />
                    <path d="M17 2l5 5" />
                    <path d="M13 5L5 13" />
                    <path d="M4 14l6 6" />
                    <path d="M3 21l6-6" />
                    <path d="M11 3l10 10" />
                </svg>
            );
        }

        if (type === "create") {
            return (
                <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <line
                        x1="12"
                        y1="5"
                        x2="12"
                        y2="19"
                    />
                    <line
                        x1="5"
                        y1="12"
                        x2="19"
                        y2="12"
                    />
                </svg>
            );
        }

        if (type === "saved") {
            return (
                <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <path d="M20 12.5c0 5-8 9-8 9s-8-4-8-9V5a3 3 0 0 1 5.5-1.7L12 5.2l2.5-1.9A3 3 0 0 1 20 5v7.5z" />
                </svg>
            );
        }

        if (type === "notifications") {
            return (
                <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                    <path d="M10 21h4" />
                </svg>
            );
        }

        return (
            <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <circle
                    cx="12"
                    cy="8"
                    r="4"
                />
                <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
            </svg>
        );
    };

    const NavItem = ({
        href,
        label,
        icon,
        badgeCount,
    }: {
        href: string;
        label: string;
        icon:
        | "dashboard"
        | "listings"
        | "auction"
        | "create"
        | "saved"
        | "notifications"
        | "profile";
        badgeCount?: number;
    }) => {
        const active = isActive(href);

        return (
            <Link
                href={href}
                onClick={closeSidebar}
                className={`
          flex
          items-center
          gap-3
          rounded-lg
          px-3
          py-2.5
          text-sm
          font-medium
          transition
          ${active
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }
        `}
            >
                <NavIcon type={icon} />
                <span className="flex-1">{label}</span>

                {typeof badgeCount === "number" && badgeCount > 0 && (
                    <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {badgeCount > 99 ? "99+" : badgeCount}
                    </span>
                )}
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-[#f8f7f4]">

            {/* MOBILE HEADER */}

            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">

                <button
                    type="button"
                    onClick={() =>
                        setSidebarOpen(true)
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-lg text-gray-700"
                    aria-label="Open dashboard menu"
                >
                    ☰
                </button>

                {/* <div className="font-bold text-gray-900">
                    ROSBOD
                </div> */}

                <div className="h-10 w-10" />

            </header>

            {/* MOBILE OVERLAY */}

            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close dashboard menu"
                    onClick={closeSidebar}
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                />
            )}

            <div className="mx-auto flex min-h-screen max-w-[1180px]">

                {/* SIDEBAR */}

                <aside
                    className={`
            fixed
            inset-y-0
            left-0
            z-50
            flex
            w-[210px]
            flex-col
            border-r
            border-gray-200
            bg-white
            transition-transform
            duration-300
            ease-in-out

            ${sidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                        }

            lg:sticky
            lg:top-0
            lg:h-screen
            lg:translate-x-0
          `}
                >

                    {/* BRAND */}

                    <div className="flex h-[72px] items-center border-b border-gray-200 px-4">

                        <div className="flex items-center gap-2.5">

                        </div>

                        {/* MOBILE CLOSE */}

                        <button
                            type="button"
                            onClick={closeSidebar}
                            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
                            aria-label="Close dashboard menu"
                        >
                            ✕
                        </button>

                    </div>

                    {/* SELLER PROFILE */}

                    <div className="border-b border-gray-200 px-4 py-4">

                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-sm font-semibold text-gray-700">

                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name || "Seller"}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span>
                                        {(
                                            user.name ||
                                            user.email ||
                                            "S"
                                        )
                                            .charAt(0)
                                            .toUpperCase()}
                                    </span>
                                )}

                            </div>

                            <div className="min-w-0">

                                <p className="truncate text-xs font-semibold text-gray-900">
                                    {user.name ||
                                        user.fullName ||
                                        user.email ||
                                        "Seller"}
                                </p>

                                <p className="text-[11px] text-gray-500">
                                    {user.role === "SELLER"
                                        ? user.isApproved
                                            ? "Verified Seller"
                                            : "Seller (pending approval)"
                                        : user.role === "ADMIN"
                                            ? "Administrator"
                                            : " "}
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* NAVIGATION */}

                    <nav className="flex-1 overflow-y-auto px-3 py-4">

                        <div className="space-y-1">

                            <NavItem
                                href="/dashboard"
                                label="Dashboard"
                                icon="dashboard"
                            />

                            {user.role === "SELLER" && (
                                <>
                                    <NavItem
                                        href="/dashboard/my-listings"
                                        label="My Listings"
                                        icon="listings"
                                    />

                                    <NavItem
                                        href="/dashboard/my-auctions"
                                        label="My Auctions"
                                        icon="auction"
                                    />

                                    <NavItem
                                        href="/create-listing"
                                        label="Create Listing"
                                        icon="create"
                                    />

                                    <NavItem
                                        href="create-auction"
                                        label="Create Auction"
                                        icon="auction"
                                    />
                                </>
                            )}

                        </div>

                        {/* DIVIDER */}

                        {user.role === "SELLER" && (
                            <div className="my-4 border-t border-gray-200" />
                        )}

                        <div className="space-y-1">

                            <NavItem
                                href="/favorites"
                                label="Saved"
                                icon="saved"
                            />

                            <NavItem
                                href="/dashboard/notifications"
                                label="Notifications"
                                icon="notifications"
                                badgeCount={unreadCount}
                            />

                            <NavItem
                                href="/dashboard/profile"
                                label="My Profile"
                                icon="profile"
                            />

                        </div>

                    </nav>

                </aside>

                {/* PAGE CONTENT */}

                <main className="min-w-0 flex-1 bg-[#f8f7f4]">

                    {children}

                </main>

            </div>

        </div>
    );
}