"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/api-config";

export default function Navbar() {
    const [user, setUser] = useState<any>(null);
    const [count, setCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);

    const [accountMenuOpen, setAccountMenuOpen] =
        useState(false);

    useEffect(() => {
        const loadUser = () => {
            const storedUser =
                localStorage.getItem("user");

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                setUser(null);
            }
        };

        loadUser();

        window.addEventListener(
            "storage",
            loadUser
        );

        window.addEventListener(
            "focus",
            loadUser
        );

        window.addEventListener(
            "authChanged",
            loadUser
        );

        return () => {
            window.removeEventListener(
                "storage",
                loadUser
            );

            window.removeEventListener(
                "focus",
                loadUser
            );

            window.removeEventListener(
                "authChanged",
                loadUser
            );
        };
    }, []);

    useEffect(() => {
        if (!user) {
            setCount(0);
            return;
        }

        const fetchCount = async () => {
            try {
                const token =
                    localStorage.getItem("token");

                const res = await fetch(
                    `${API_BASE_URL}/api/notifications/unread-count`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) {
                    return;
                }

                const data =
                    await res.json();

                setCount(
                    Number(data.count) || 0
                );
            } catch (error) {
                console.error(
                    "Failed to fetch notification count:",
                    error
                );
            }
        };

        fetchCount();
        window.addEventListener("notificationsUpdated", fetchCount);
        return () => {
            window.removeEventListener("notificationsUpdated", fetchCount);
        };
    }, [user]);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.dispatchEvent(
            new Event("authChanged")
        );

        window.location.href = "/";
    };

    const closeMenus = () => {
        setMobileMenuOpen(false);
        setAccountMenuOpen(false);
    };

    const dashboardLink =
        user?.role === "ADMIN"
            ? "/admin"
            : "/dashboard";

    const notificationLink =
        user?.role === "ADMIN"
            ? "/admin/notifications"
            : user?.role === "SELLER"
                ? "/dashboard/notifications"
                : "/notifications";

    const canCreateListing =
        user?.role === "SELLER" ||
        user?.role === "ADMIN";

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
            <nav className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">

                {/* LOGO */}

                <Link
                    href="/"
                    onClick={closeMenus}
                    className="flex shrink-0 items-center gap-3"
                >
                    <img
                        src="/logo1.jpg"
                        alt="Rosebod"
                        className="h-10 w-10 rounded-lg object-cover"
                    />

                    <span className="text-xl font-extrabold tracking-tight text-[#202226] sm:text-2xl">
                        Rosebod
                    </span>
                </Link>

                {/* DESKTOP NAVIGATION */}

                <div className="hidden items-center gap-7 lg:flex">

                    <Link
                        href="/listings"
                        className="text-sm font-semibold text-gray-600 transition hover:text-[#ff9900]"
                    >
                        Browse Assets
                    </Link>

                    <Link
                        href="/auctions"
                        className="text-sm font-semibold text-gray-600 transition hover:text-[#ff9900]"
                    >
                        Auctions
                    </Link>

                    <Link
                        href="/favorites"
                        className="text-sm font-semibold text-gray-600 transition hover:text-[#ff9900]"
                    >
                        Favorites
                    </Link>

                    {user && (
                        <Link
                            href={dashboardLink}
                            className="text-sm font-semibold text-gray-600 transition hover:text-[#ff9900]"
                        >
                            Dashboard
                        </Link>
                    )}

                </div>

                {/* DESKTOP ACTIONS */}

                <div className="hidden items-center gap-3 lg:flex">

                    {!user && (
                        <>
                            <Link
                                href="/login"
                                className="rounded-lg px-4 py-2.5 text-sm font-bold text-[#202226] transition hover:bg-gray-100"
                            >
                                Sign In
                            </Link>

                            <Link
                                href="/register"
                                className="rounded-lg border border-[#202226] px-4 py-2.5 text-sm font-bold text-[#202226] transition hover:bg-gray-100"
                            >
                                Register
                            </Link>
                        </>
                    )}

                    {user && (
                        <>
                            {/* NOTIFICATIONS */}

                            <Link
                                href={notificationLink}
                                className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 text-lg transition hover:border-[#ff9900] hover:bg-orange-50"
                                aria-label="Notifications"
                            >
                                🔔

                                {count > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                                        {count > 99
                                            ? "99+"
                                            : count}
                                    </span>
                                )}
                            </Link>

                            {/* ACCOUNT MENU */}

                            <div className="relative">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setAccountMenuOpen(
                                            !accountMenuOpen
                                        )
                                    }
                                    className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-bold text-[#202226] transition hover:border-[#ff9900]"
                                >
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#202226] text-xs font-bold text-white">
                                        {user.name
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </span>

                                    <span className="max-w-28 truncate">
                                        {user.name}
                                    </span>

                                    <span className="text-xs">
                                        ▾
                                    </span>
                                </button>

                                {accountMenuOpen && (
                                    <div className="absolute right-0 top-[calc(100%+10px)] w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl">

                                        <div className="border-b border-gray-100 px-4 py-3">
                                            <p className="truncate text-sm font-bold text-[#202226]">
                                                {user.name}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                {user.role}
                                            </p>
                                        </div>

                                        <Link
                                            href={dashboardLink}
                                            onClick={closeMenus}
                                            className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-[#d97706]"
                                        >
                                            Dashboard
                                        </Link>

                                        <Link
                                            href="/dashboard/profile"
                                            onClick={closeMenus}
                                            className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-[#d97706]"
                                        >
                                            My Profile
                                        </Link>

                                        <Link
                                            href="/favorites"
                                            onClick={closeMenus}
                                            className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-[#d97706]"
                                        >
                                            Saved Listings
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={logout}
                                            className="w-full px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                                        >
                                            Log Out
                                        </button>

                                    </div>
                                )}

                            </div>
                        </>
                    )}

                    {canCreateListing && (
                        <Link
                            href="/create"
                            className="rounded-lg bg-[#ff9900] px-5 py-3 text-sm font-extrabold text-[#202226] shadow-sm transition hover:bg-[#ffad28]"
                        >
                            + List an Asset
                        </Link>
                    )}

                    {!user && (
                        <Link
                            href="/register"
                            className="rounded-lg bg-[#ff9900] px-5 py-3 text-sm font-extrabold text-[#202226] shadow-sm transition hover:bg-[#ffad28]"
                        >
                            Get Started
                        </Link>
                    )}

                </div>

                {/* MOBILE MENU BUTTON */}

                <button
                    type="button"
                    onClick={() =>
                        setMobileMenuOpen(
                            !mobileMenuOpen
                        )
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 text-xl text-[#202226] lg:hidden"
                    aria-label="Toggle navigation"
                    aria-expanded={
                        mobileMenuOpen
                    }
                >
                    {mobileMenuOpen
                        ? "✕"
                        : "☰"}
                </button>

            </nav>

            {/* MOBILE MENU */}

            {mobileMenuOpen && (
                <div className="border-t border-gray-200 bg-white px-5 py-5 shadow-xl lg:hidden">

                    <div className="mx-auto max-w-[1440px] space-y-2">

                        <Link
                            href="/"
                            onClick={closeMenus}
                            className="block rounded-lg px-4 py-3 text-sm font-bold text-[#202226] hover:bg-orange-50"
                        >
                            Home
                        </Link>

                        <Link
                            href="/listings"
                            onClick={closeMenus}
                            className="block rounded-lg px-4 py-3 text-sm font-bold text-[#202226] hover:bg-orange-50"
                        >
                            Browse Assets
                        </Link>

                        <Link
                            href="/auctions"
                            onClick={closeMenus}
                            className="block rounded-lg px-4 py-3 text-sm font-bold text-[#202226] hover:bg-orange-50"
                        >
                            Auctions
                        </Link>

                        <Link
                            href="/favorites"
                            onClick={closeMenus}
                            className="block rounded-lg px-4 py-3 text-sm font-bold text-[#202226] hover:bg-orange-50"
                        >
                            ❤️ Favorites
                        </Link>

                        {user && (
                            <>
                                <Link
                                    href={dashboardLink}
                                    onClick={closeMenus}
                                    className="block rounded-lg px-4 py-3 text-sm font-bold text-[#202226] hover:bg-orange-50"
                                >
                                    Dashboard
                                </Link>

                                <Link
                                    href="/dashboard/profile"
                                    onClick={closeMenus}
                                    className="block rounded-lg px-4 py-3 text-sm font-bold text-[#202226] hover:bg-orange-50"
                                >
                                    My Profile
                                </Link>

                                <Link
                                    href={notificationLink}
                                    onClick={closeMenus}
                                    className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-bold text-[#202226] hover:bg-orange-50"
                                >
                                    Notifications

                                    {count > 0 && (
                                        <span className="rounded-full bg-red-600 px-2 py-1 text-xs text-white">
                                            {count}
                                        </span>
                                    )}
                                </Link>
                            </>
                        )}

                        <div className="my-3 border-t border-gray-200" />

                        {!user && (
                            <div className="grid grid-cols-2 gap-3">

                                <Link
                                    href="/login"
                                    onClick={closeMenus}
                                    className="rounded-lg border border-[#202226] px-4 py-3 text-center text-sm font-bold text-[#202226]"
                                >
                                    Sign In
                                </Link>

                                <Link
                                    href="/register"
                                    onClick={closeMenus}
                                    className="rounded-lg bg-[#ff9900] px-4 py-3 text-center text-sm font-extrabold text-[#202226]"
                                >
                                    Register
                                </Link>

                            </div>
                        )}

                        {canCreateListing && (
                            <Link
                                href="/create"
                                onClick={closeMenus}
                                className="block rounded-lg bg-[#ff9900] px-4 py-3 text-center text-sm font-extrabold text-[#202226]"
                            >
                                + List an Asset
                            </Link>
                        )}

                        {user && (
                            <button
                                type="button"
                                onClick={logout}
                                className="w-full rounded-lg bg-red-50 px-4 py-3 text-left text-sm font-bold text-red-600"
                            >
                                Log Out
                            </button>
                        )}

                    </div>

                </div>
            )}

        </header>
    );
}