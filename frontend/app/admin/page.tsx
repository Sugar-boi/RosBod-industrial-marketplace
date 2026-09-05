"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import API_BASE_URL from "@/lib/api-config";

type AdminStats = {
    totalUsers: number;
    totalSellers: number;
    pendingSellers: number;

    totalListings: number;
    approvedListings: number;
    pendingListings: number;
    rejectedListings: number;

    totalAuctions: number;
    activeAuctions: number;
    endedAuctions: number;

    totalBids: number;
};

type StatCardProps = {
    title: string;
    value: number;
    icon: string;
    iconBg: string;
    href?: string;
    status?: string;
};

type QueueListing = {
    id: number;
    title: string;
    createdAt?: string;
    user?: { name?: string };
    seller?: { name?: string };
    category?: { name?: string };
};

type QueueSeller = {
    id: number;
    name?: string;
    email?: string;
    companyName?: string;
    createdAt?: string;
};

function StatCard({
    title,
    value,
    icon,
    iconBg,
    href,
    status,
}: StatCardProps) {
    const content = (
        <div className="flex min-h-[105px] items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
            <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lg ${iconBg}`}
            >
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-[11px] font-medium text-gray-500">
                    {title}
                </p>

                <p className="mt-1 text-2xl font-extrabold tracking-tight text-[#24272b]">
                    {value.toLocaleString()}
                </p>

                {status && (
                    <p className="mt-1 text-[10px] font-semibold text-green-600">
                        • {status}
                    </p>
                )}
            </div>
        </div>
    );

    if (!href) {
        return content;
    }

    return (
        <Link href={href} className="block">
            {content}
        </Link>
    );
}

function MiniBar({
    label,
    value,
    max,
}: {
    label: string;
    value: number;
    max: number;
}) {
    const width =
        max > 0
            ? Math.max(4, Math.round((value / max) * 100))
            : 4;

    return (
        <div>
            <div className="mb-1 flex items-center justify-between gap-3">
                <span className="truncate text-[11px] text-gray-500">
                    {label}
                </span>

                <span className="text-[11px] font-bold text-gray-700">
                    {value.toLocaleString()}
                </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                    className="h-full rounded-full bg-[#ff9900]"
                    style={{ width: `${width}%` }}
                />
            </div>
        </div>
    );
}

export default function AdminDashboardPage() {
    const [stats, setStats] =
        useState<AdminStats | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");
    const [pendingListingsQueue, setPendingListingsQueue] = useState<QueueListing[]>([]);
    const [pendingSellersQueue, setPendingSellersQueue] = useState<QueueSeller[]>([]);


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            setError("Not authenticated");
            return;
        }

        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const load = async () => {
            try {
                setLoading(true);
                setError("");

                const [statsRes, listingsRes, sellersRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/admin/dashboard-stats`, {
                        headers,
                    }),
                    fetch(`${API_BASE_URL}/api/admin/pending-listings`, {
                        headers,
                    }),
                    fetch(`${API_BASE_URL}/api/admin/pending-sellers`, {
                        headers,
                    }),
                ]);

                const statsData = await statsRes.json();

                if (!statsRes.ok) {
                    throw new Error(
                        statsData.message || "Failed to load dashboard"
                    );
                }

                setStats(statsData);

                if (listingsRes.ok) {
                    const listingsData = await listingsRes.json();
                    const list = Array.isArray(listingsData)
                        ? listingsData
                        : listingsData.listings || [];
                    setPendingListingsQueue(list.slice(0, 5));
                }

                if (sellersRes.ok) {
                    const sellersData = await sellersRes.json();
                    const list = Array.isArray(sellersData)
                        ? sellersData
                        : sellersData.sellers || [];
                    setPendingSellersQueue(list.slice(0, 5));
                }
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const categoryData = useMemo(() => {
        if (!stats) return [];

        /*
         * We don't have category totals from the
         * dashboard-stats endpoint, so don't invent
         * category numbers.
         *
         * These rows use real dashboard totals to
         * give the section useful information until
         * a dedicated category endpoint is connected.
         */
        return [
            {
                label: "Approved Listings",
                value: stats.approvedListings,
            },
            {
                label: "Pending Listings",
                value: stats.pendingListings,
            },
            {
                label: "Rejected Listings",
                value: stats.rejectedListings,
            },
        ];
    }, [stats]);

    if (loading) {
        return (
            <main className="min-h-screen bg-[#f7f7f5] p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-[1500px]">
                    <div className="animate-pulse">
                        <div className="h-8 w-64 rounded bg-gray-200" />
                        <div className="mt-2 h-4 w-80 rounded bg-gray-200" />

                        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
                            {Array.from({
                                length: 8,
                            }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-28 rounded-xl bg-gray-200"
                                />
                            ))}
                        </div>

                        <div className="mt-6 grid gap-5 xl:grid-cols-[1.7fr_1fr]">
                            <div className="h-80 rounded-xl bg-gray-200" />
                            <div className="h-80 rounded-xl bg-gray-200" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error || !stats) {
        return (
            <main className="min-h-screen bg-[#f7f7f5] p-6">
                <div className="mx-auto max-w-[1500px]">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                        <h1 className="font-bold text-red-700">
                            Unable to load dashboard
                        </h1>

                        <p className="mt-2 text-sm text-red-600">
                            {error ||
                                "No dashboard data was returned."}
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    const maxStatusValue =
        Math.max(
            stats.approvedListings,
            stats.pendingListings,
            stats.rejectedListings,
            1
        );

    return (
        <main className="min-h-screen bg-[#f7f7f5]">
            <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">

                {/* HEADER */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-[#24272b] sm:text-3xl">
                            Admin Dashboard
                        </h1>

                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                            Rosebod Marketplace
                            {" • "}
                            Overview and marketplace activity
                        </p>
                    </div>

                    <Link
                        href="/admin/notifications"
                        className="flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 shadow-sm hover:border-[#ff9900]"
                    >
                        <span>🔔</span>
                        Notifications
                    </Link>
                </div>

                {/* APPROVAL ALERT */}

                {stats.pendingListings +
                    stats.pendingSellers >
                    0 && (
                        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-orange-200 bg-[#fff8eb] p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                    ⚠️
                                </div>

                                <div>
                                    <h2 className="text-xs font-extrabold text-[#24272b]">
                                        Approvals require your attention
                                    </h2>

                                    <p className="mt-1 text-[11px] leading-5 text-gray-500">
                                        You currently have{" "}
                                        <strong>
                                            {
                                                stats.pendingListings
                                            }
                                        </strong>{" "}
                                        pending listing
                                        {stats.pendingListings !==
                                            1
                                            ? "s"
                                            : ""}{" "}
                                        and{" "}
                                        <strong>
                                            {
                                                stats.pendingSellers
                                            }
                                        </strong>{" "}
                                        pending seller
                                        {stats.pendingSellers !==
                                            1
                                            ? "s"
                                            : ""}.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Link
                                    href="/admin/pending-listings"
                                    className="rounded-lg bg-[#ff9900] px-4 py-2 text-[11px] font-extrabold text-[#24272b] hover:bg-[#ffad28]"
                                >
                                    Review Listings →
                                </Link>

                                <Link
                                    href="/admin/pending-sellers"
                                    className="hidden rounded-lg border border-gray-300 bg-white px-4 py-2 text-[11px] font-bold text-gray-700 hover:bg-gray-50 sm:block"
                                >
                                    Sellers
                                </Link>
                            </div>
                        </div>
                    )}

                {/* STAT CARDS */}

                <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">

                    <StatCard
                        title="Pending Listings"
                        value={
                            stats.pendingListings
                        }
                        icon="◉"
                        iconBg="bg-orange-50 text-orange-500"
                        href="/admin/pending-listings"
                    />

                    <StatCard
                        title="Pending Sellers"
                        value={
                            stats.pendingSellers
                        }
                        icon="♟"
                        iconBg="bg-yellow-50 text-yellow-600"
                        href="/admin/pending-sellers"
                    />

                    <StatCard
                        title="Approved Listings"
                        value={
                            stats.approvedListings
                        }
                        icon="✓"
                        iconBg="bg-green-50 text-green-600"
                        href="/admin/listings"
                        status="Live"
                    />

                    <StatCard
                        title="Rejected Listings"
                        value={
                            stats.rejectedListings
                        }
                        icon="×"
                        iconBg="bg-red-50 text-red-500"
                        href="/admin/listings"
                    />

                    <StatCard
                        title="Active Auctions"
                        value={
                            stats.activeAuctions
                        }
                        icon="⚒"
                        iconBg="bg-green-50 text-green-600"
                        href="/admin/auctions"
                        status="Live"
                    />

                    <StatCard
                        title="Total Users"
                        value={
                            stats.totalUsers
                        }
                        icon="♟"
                        iconBg="bg-blue-50 text-blue-600"
                        href="/admin/users"
                    />

                    <StatCard
                        title="Total Sellers"
                        value={
                            stats.totalSellers
                        }
                        icon="♙"
                        iconBg="bg-purple-50 text-purple-600"
                        href="/admin/sellers"
                    />

                    <StatCard
                        title="Total Bids"
                        value={
                            stats.totalBids
                        }
                        icon="◆"
                        iconBg="bg-orange-50 text-orange-500"
                        href="/admin/bids"
                    />
                </section>

                {/* MAIN ANALYTICS */}

                <section className="mt-5 grid gap-5 xl:grid-cols-[1.65fr_1fr]">

                    {/* LISTING SUBMISSIONS */}

                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-sm font-extrabold text-[#24272b]">
                                    Listing Overview
                                </h2>

                                <p className="mt-1 text-[11px] text-gray-500">
                                    Current listing approval status
                                </p>
                            </div>

                            <Link
                                href="/admin/listings"
                                className="text-[11px] font-semibold text-[#d97706] hover:underline"
                            >
                                View all →
                            </Link>
                        </div>

                        {/* SIMPLE VISUAL BAR */}

                        <div className="mt-8 flex h-[210px] items-end gap-4 border-b border-gray-100 px-2 pb-0 sm:gap-8">

                            {[
                                {
                                    label: "Approved",
                                    value:
                                        stats.approvedListings,
                                },
                                {
                                    label: "Pending",
                                    value:
                                        stats.pendingListings,
                                },
                                {
                                    label: "Rejected",
                                    value:
                                        stats.rejectedListings,
                                },
                            ].map(
                                (item) => {
                                    const height =
                                        Math.max(
                                            8,
                                            Math.round(
                                                (item.value /
                                                    maxStatusValue) *
                                                170
                                            )
                                        );

                                    return (
                                        <div
                                            key={
                                                item.label
                                            }
                                            className="flex h-full flex-1 flex-col items-center justify-end"
                                        >
                                            <span className="mb-2 text-[10px] font-bold text-gray-500">
                                                {item.value.toLocaleString()}
                                            </span>

                                            <div
                                                className="w-full max-w-[70px] rounded-t-md bg-[#ff9900]"
                                                style={{
                                                    height: `${height}px`,
                                                }}
                                            />

                                            <span className="mt-3 text-center text-[10px] font-medium text-gray-500">
                                                {
                                                    item.label
                                                }
                                            </span>
                                        </div>
                                    );
                                }
                            )}

                        </div>

                        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-gray-500">
                            <span>
                                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-[#ff9900]" />
                                Listing status
                            </span>

                            <span>
                                Total listings:{" "}
                                <strong className="text-gray-700">
                                    {stats.totalListings.toLocaleString()}
                                </strong>
                            </span>
                        </div>
                    </div>

                    {/* CATEGORY / MARKETPLACE SUMMARY */}

                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-extrabold text-[#24272b]">
                                    Marketplace Breakdown
                                </h2>

                                <p className="mt-1 text-[11px] text-gray-500">
                                    Listing and auction totals
                                </p>
                            </div>

                            <span className="text-[10px] text-gray-400">
                                Live data
                            </span>
                        </div>

                        <div className="mt-6 space-y-5">

                            {categoryData.map(
                                (item) => (
                                    <MiniBar
                                        key={
                                            item.label
                                        }
                                        label={
                                            item.label
                                        }
                                        value={
                                            item.value
                                        }
                                        max={
                                            maxStatusValue
                                        }
                                    />
                                )
                            )}

                        </div>

                        <div className="mt-7 border-t border-gray-100 pt-5">

                            <h3 className="text-[11px] font-bold text-gray-700">
                                Auction Activity
                            </h3>

                            <div className="mt-3 grid grid-cols-2 gap-3">

                                <div className="rounded-lg bg-gray-50 p-3">
                                    <p className="text-[10px] text-gray-500">
                                        Total Auctions
                                    </p>

                                    <p className="mt-1 text-lg font-extrabold text-[#24272b]">
                                        {stats.totalAuctions.toLocaleString()}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-green-50 p-3">
                                    <p className="text-[10px] text-gray-500">
                                        Active
                                    </p>

                                    <p className="mt-1 text-lg font-extrabold text-green-700">
                                        {stats.activeAuctions.toLocaleString()}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-3">
                                    <p className="text-[10px] text-gray-500">
                                        Ended
                                    </p>

                                    <p className="mt-1 text-lg font-extrabold text-[#24272b]">
                                        {stats.endedAuctions.toLocaleString()}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-orange-50 p-3">
                                    <p className="text-[10px] text-gray-500">
                                        Total Bids
                                    </p>

                                    <p className="mt-1 text-lg font-extrabold text-[#24272b]">
                                        {stats.totalBids.toLocaleString()}
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                {/* LOWER SECTIONS */}

                <section className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">

                    {/* QUICK APPROVAL */}

                    <div className="mt-5 divide-y divide-gray-100">
                        {pendingListingsQueue.length === 0 &&
                            pendingSellersQueue.length === 0 && (
                                <p className="py-6 text-center text-sm text-gray-400">
                                    Nothing pending right now.
                                </p>
                            )}

                        {pendingListingsQueue.map((item) => (
                            <div
                                key={`listing-${item.id}`}
                                className="flex items-center justify-between gap-4 py-3"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50">
                                        📦
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="truncate text-xs font-bold text-gray-700">
                                                {item.title}
                                            </p>
                                            <span className="rounded bg-orange-50 px-1.5 py-0.5 text-[9px] font-bold text-orange-600">
                                                Listing
                                            </span>
                                        </div>
                                        <p className="mt-1 truncate text-[10px] text-gray-400">
                                            {item.user?.name ||
                                                item.seller?.name ||
                                                "Seller"}{" "}
                                            {item.category?.name
                                                ? `• ${item.category.name}`
                                                : ""}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex shrink-0 gap-2">
                                    {/* <Link
                                        href={`/admin/pending-listings`}
                                        className="rounded-md border border-gray-200 px-3 py-1.5 text-[10px] font-bold text-gray-600 hover:bg-gray-50"
                                    >
                                        View
                                    </Link> */}
                                    <Link
                                        href={`/listings/${item.id}`}
                                        className="rounded-md bg-[#ff9900] px-3 py-1.5 text-[10px] font-bold text-[#24272b] hover:bg-[#ffad28]"
                                    >
                                        Review
                                    </Link>
                                </div>
                            </div>
                        ))}

                        {pendingSellersQueue.map((item) => (
                            <div
                                key={`seller-${item.id}`}
                                className="flex items-center justify-between gap-4 py-3"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50">
                                        ♟
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="truncate text-xs font-bold text-gray-700">
                                                {item.companyName || item.name || item.email}
                                            </p>
                                            <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[9px] font-bold text-purple-600">
                                                Seller
                                            </span>
                                        </div>
                                        <p className="mt-1 truncate text-[10px] text-gray-400">
                                            {item.email || "Pending seller approval"}
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href="/admin/pending-sellers"
                                    className="shrink-0 rounded-md bg-[#ff9900] px-3 py-1.5 text-[10px] font-bold text-[#24272b] hover:bg-[#ffad28]"
                                >
                                    Review
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* RECENT ACTIVITY */}

                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-extrabold text-[#24272b]">
                                    Marketplace Summary
                                </h2>

                                <p className="mt-1 text-[11px] text-gray-500">
                                    Current platform activity
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 divide-y divide-gray-100">

                            <div className="flex gap-3 py-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50 text-sm">
                                    ✓
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-gray-700">
                                        Approved Listings
                                    </p>

                                    <p className="mt-1 text-[10px] text-gray-400">
                                        {
                                            stats.approvedListings
                                        }{" "}
                                        listings are currently approved.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 py-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-sm">
                                    ⏳
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-gray-700">
                                        Pending Listings
                                    </p>

                                    <p className="mt-1 text-[10px] text-gray-400">
                                        {
                                            stats.pendingListings
                                        }{" "}
                                        listings require review.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 py-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm">
                                    ♟
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-gray-700">
                                        Total Users
                                    </p>

                                    <p className="mt-1 text-[10px] text-gray-400">
                                        {
                                            stats.totalUsers
                                        }{" "}
                                        registered marketplace users.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 py-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-sm">
                                    🔨
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-gray-700">
                                        Active Auctions
                                    </p>

                                    <p className="mt-1 text-[10px] text-gray-400">
                                        {
                                            stats.activeAuctions
                                        }{" "}
                                        auctions currently active.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                </section>

            </div>
        </main>
    );
}
// "use client";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import API_BASE_URL from "@/lib/api-config";

// export default function AdminDashboardPage() {
//     const [stats, setStats] =
//         useState<any>(null);

//     useEffect(() => {
//         const fetchStats = async () => {
//             try {
//                 const token =
//                     localStorage.getItem("token");

//                 const res = await fetch(
//                     `${API_BASE_URL}/api/admin/dashboard-stats`,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         },
//                     }
//                 );

//                 const data =
//                     await res.json();

//                 setStats(data);
//             } catch (error) {
//                 console.error(error);
//             }
//         };

//         fetchStats();
//     }, []);

//     if (!stats) {
//         return (
//             <div className="p-10">
//                 Loading...
//             </div>
//         );
//     }

//     return (
//         <div className="p-10">
//             <h1 className="text-4xl font-bold mb-8">
//                 Admin Dashboard
//             </h1>

//             <div className="grid md:grid-cols-3 gap-6">

//                 <Link href="/admin/users">
//                     <div className="border rounded-xl p-6 hover:shadow-lg cursor-pointer">
//                         <h2 className="text-gray-500">
//                             Total Users
//                         </h2>

//                         <p className="text-4xl font-bold">
//                             {stats.totalUsers}
//                         </p>
//                     </div>
//                 </Link>

//                 <Link href="/admin/sellers">
//                     <div className="border rounded-xl p-6 hover:shadow-lg cursor-pointer">
//                         <h2 className="text-gray-500">
//                             Total Sellers
//                         </h2>

//                         <p className="text-4xl font-bold">
//                             {stats.totalSellers}
//                         </p>
//                     </div>
//                 </Link>

//                 <Link href="/admin/pending-sellers">
//                     <div className="border border-yellow-400 bg-yellow-100 rounded-xl p-6 hover:shadow-lg">
//                         <h2 className="text-gray-500">
//                             Pending Sellers
//                         </h2>

//                         <p className="text-4xl font-bold">
//                             {stats.pendingSellers}
//                         </p>
//                     </div>
//                 </Link>

//                 <Link href="/admin/listings">
//                     <div className="border rounded-xl p-6 hover:shadow-lg cursor-pointer">
//                         <h2 className="text-gray-500">
//                             Total Listings
//                         </h2>

//                         <p className="text-4xl font-bold">
//                             {stats.totalListings}
//                         </p>
//                     </div>
//                 </Link>

//                 <Link href="/admin/pending-listings">
//                     <div className="border border-yellow-400 bg-yellow-100 rounded-xl p-6 hover:shadow-lg">
//                         <h2 className="text-gray-500">
//                             Pending Listings
//                         </h2>

//                         <p className="text-4xl font-bold">
//                             {stats.pendingListings}
//                         </p>
//                     </div>
//                 </Link>

//                 <Link href="/admin/auctions">
//                     <div className="border rounded-xl p-6 hover:shadow-lg cursor-pointer">
//                         <h2 className="text-gray-500">
//                             Auctions
//                         </h2>

//                         <p className="text-4xl font-bold">
//                             {stats.totalAuctions}
//                         </p>
//                     </div>
//                 </Link>

//                 <Link href="/admin/bids">
//                     <div className="border rounded-xl p-6 hover:shadow-lg cursor-pointer">
//                         <h2 className="text-gray-500">
//                             Total Bids
//                         </h2>

//                         <p className="text-4xl font-bold">
//                             {stats.totalBids}
//                         </p>
//                     </div>
//                 </Link>

//             </div>
//         </div>
//     );
// }