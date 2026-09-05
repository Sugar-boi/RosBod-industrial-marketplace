"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api-fetch";

export default function MyListingsPage() {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    const searchParams = useSearchParams();
    const filter = searchParams.get("filter");

    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);

                const res = await apiFetch(
                    "/api/listings/my-listings"
                );

                const data = await res.json();

                console.log(
                    "MY LISTINGS API RESPONSE:",
                    data
                );

                if (!res.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to load listings"
                    );
                }

                setListings(
                    Array.isArray(data)
                        ? data
                        : []
                );
            } catch (error) {
                console.error(
                    "Failed to load listings:",
                    error
                );

                setListings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    /*
     * --------------------------------------------------
     * COUNTS
     * --------------------------------------------------
     */

    const allCount = listings.length;

    const approvedCount = listings.filter(
        (listing) =>
            listing.isApproved === true &&
            listing.status !== "REJECTED"
    ).length;

    const pendingCount = listings.filter(
        (listing) =>
            listing.status === "PENDING"
    ).length;

    const rejectedCount = listings.filter(
        (listing) =>
            listing.status === "REJECTED"
    ).length;

    const soldCount = listings.filter(
        (listing) =>
            listing.isSold === true
    ).length;

    const auctionCount = listings.filter(
        (listing) =>
            listing.isAuction === true
    ).length;

    /*
     * --------------------------------------------------
     * CATEGORIES
     * --------------------------------------------------
     */

    const categories = useMemo(() => {
        const names = listings
            .map(
                (listing) =>
                    listing.category?.name
            )
            .filter(Boolean);

        return Array.from(
            new Set(names)
        );
    }, [listings]);

    /*
     * --------------------------------------------------
     * FILTER LISTINGS
     * --------------------------------------------------
     */

    const filteredListings = listings.filter(
        (listing) => {

            /*
             * Sidebar / URL filter
             */

            if (
                filter &&
                filter !== "all"
            ) {
                if (
                    filter === "sold" &&
                    listing.isSold !== true
                ) {
                    return false;
                }

                if (
                    filter === "active" &&
                    !(
                        listing.isSold !== true &&
                        listing.isApproved === true
                    )
                ) {
                    return false;
                }

                if (
                    filter === "pending" &&
                    listing.status !== "PENDING"
                ) {
                    return false;
                }

                if (
                    filter === "rejected" &&
                    listing.status !== "REJECTED"
                ) {
                    return false;
                }

                if (
                    filter === "auctions" &&
                    listing.isAuction !== true
                ) {
                    return false;
                }
            }

            /*
             * Category filter
             */

            if (
                categoryFilter !== "all" &&
                listing.category?.name !==
                categoryFilter
            ) {
                return false;
            }

            /*
             * Search
             */

            if (search.trim()) {
                const searchText =
                    search
                        .toLowerCase()
                        .trim();

                const title =
                    String(
                        listing.title || ""
                    ).toLowerCase();

                const category =
                    String(
                        listing.category?.name ||
                        ""
                    ).toLowerCase();

                if (
                    !title.includes(
                        searchText
                    ) &&
                    !category.includes(
                        searchText
                    )
                ) {
                    return false;
                }
            }

            return true;
        }
    );

    /*
     * --------------------------------------------------
     * STATUS
     * --------------------------------------------------
     */

    const getStatus = (
        listing: any
    ) => {
        if (
            listing.status ===
            "REJECTED"
        ) {
            return {
                label: "Rejected",
                className:
                    "bg-red-50 text-red-700 border-red-200",
            };
        }

        if (
            listing.isSold === true
        ) {
            return {
                label: "Sold",
                className:
                    "bg-purple-50 text-purple-700 border-purple-200",
            };
        }

        if (
            listing.isApproved === true
        ) {
            return {
                label: "Approved",
                className:
                    "bg-green-50 text-green-700 border-green-200",
            };
        }

        return {
            label: "Pending Approval",
            className:
                "bg-yellow-50 text-yellow-700 border-yellow-200",
        };
    };

    /*
     * --------------------------------------------------
     * TAB
     * --------------------------------------------------
     */

    const tabs = [
        {
            key: "all",
            label: "All Listings",
            count: allCount,
        },
        {
            key: "active",
            label: "Approved",
            count: approvedCount,
        },
        {
            key: "pending",
            label: "Pending",
            count: pendingCount,
        },
        {
            key: "rejected",
            label: "Rejected",
            count: rejectedCount,
        },
        {
            key: "sold",
            label: "Sold",
            count: soldCount,
        },
        {
            key: "auctions",
            label: "Auctions",
            count: auctionCount,
        },
    ];

    /*
     * --------------------------------------------------
     * RENDER
     * --------------------------------------------------
     */

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                {/* HEADER */}

                <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            My Listings
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage all your industrial asset listings
                        </p>
                    </div>

                    <Link
                        href="/dashboard/create-listing"
                        className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
                    >
                        + Create Listing
                    </Link>

                </div>

                {/* MAIN CARD */}

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                    {/* TABS */}

                    <div className="overflow-x-auto border-b border-gray-200">

                        <div className="flex min-w-max">

                            {tabs.map(
                                (tab) => {

                                    const active =
                                        (
                                            filter ||
                                            "all"
                                        ) ===
                                        tab.key;

                                    const href =
                                        tab.key ===
                                            "all"
                                            ? "/dashboard/my-listings"
                                            : `/dashboard/my-listings?filter=${tab.key}`;

                                    return (
                                        <Link
                                            key={
                                                tab.key
                                            }
                                            href={
                                                href
                                            }
                                            className={`relative px-5 py-4 text-sm font-medium transition ${active
                                                    ? "text-orange-600"
                                                    : "text-gray-500 hover:text-gray-900"
                                                }`}
                                        >

                                            {
                                                tab.label
                                            }

                                            <span
                                                className={`ml-2 rounded-full px-2 py-0.5 text-xs ${active
                                                        ? "bg-orange-100 text-orange-700"
                                                        : "bg-gray-100 text-gray-500"
                                                    }`}
                                            >
                                                {
                                                    tab.count
                                                }
                                            </span>

                                            {active && (
                                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-orange-500" />
                                            )}

                                        </Link>
                                    );
                                }
                            )}

                        </div>

                    </div>

                    {/* SEARCH / FILTER BAR */}

                    <div className="border-b border-gray-200 p-4">

                        <div className="flex flex-col gap-3 md:flex-row">

                            {/* SEARCH */}

                            <div className="relative flex-1">

                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    🔍
                                </span>

                                <input
                                    type="text"
                                    value={
                                        search
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search listings..."
                                    className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                                />

                            </div>

                            {/* CATEGORY */}

                            <select
                                value={
                                    categoryFilter
                                }
                                onChange={(
                                    e
                                ) =>
                                    setCategoryFilter(
                                        e.target.value
                                    )
                                }
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                            >

                                <option value="all">
                                    All Categories
                                </option>

                                {categories.map(
                                    (
                                        category
                                    ) => (
                                        <option
                                            key={
                                                category
                                            }
                                            value={
                                                category
                                            }
                                        >
                                            {
                                                category
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                        </div>

                    </div>

                    {/* LISTINGS */}

                    <div className="p-4">

                        {loading ? (
                            <div className="py-16 text-center text-sm text-gray-500">
                                Loading listings...
                            </div>
                        ) : filteredListings.length ===
                            0 ? (
                            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">

                                <div className="mb-3 text-3xl">
                                    📦
                                </div>

                                <p className="font-semibold text-gray-800">
                                    No listings found
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    Try changing your filters or create a new listing.
                                </p>

                            </div>
                        ) : (
                            <div className="space-y-3">

                                {filteredListings.map(
                                    (
                                        listing
                                    ) => {

                                        const image =
                                            listing
                                                .images?.[0]
                                                ?.imageUrl ||
                                            "/placeholder.jpg";

                                        const status =
                                            getStatus(
                                                listing
                                            );

                                        return (
                                            <div
                                                key={
                                                    listing.id
                                                }
                                                className="group rounded-xl border border-gray-200 bg-white p-3 transition hover:border-gray-300 hover:shadow-sm"
                                            >

                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                                                    {/* IMAGE */}

                                                    <div className="h-24 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-24 sm:w-32">

                                                        <img
                                                            src={
                                                                image
                                                            }
                                                            alt={
                                                                listing.title
                                                            }
                                                            className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                                                        />

                                                    </div>

                                                    {/* INFORMATION */}

                                                    <div className="min-w-0 flex-1">

                                                        <Link
                                                            href={`/dashboard/my-listings/${listing.id}`}
                                                        >

                                                            <h2 className="truncate text-base font-semibold text-gray-900 hover:text-orange-600">
                                                                {
                                                                    listing.title
                                                                }
                                                            </h2>

                                                        </Link>

                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {
                                                                listing
                                                                    .category
                                                                    ?.name ||
                                                                "Uncategorized"
                                                            }
                                                        </p>

                                                        <div className="mt-3 flex flex-wrap items-center gap-3">

                                                            <span className="text-base font-bold text-gray-900">
                                                                ₦
                                                                {Number(
                                                                    listing.price ||
                                                                    0
                                                                ).toLocaleString()}
                                                            </span>

                                                            <span
                                                                className={`rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
                                                            >
                                                                {
                                                                    status.label
                                                                }
                                                            </span>

                                                            {listing.isAuction ===
                                                                true && (
                                                                    <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
                                                                        Auction
                                                                    </span>
                                                                )}

                                                        </div>

                                                    </div>

                                                    {/* ACTIONS */}

                                                    <div className="flex shrink-0 items-center gap-2 sm:flex-col">

                                                        <Link
                                                            href={`/dashboard/my-listings/${listing.id}`}
                                                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                                                        >
                                                            View
                                                        </Link>

                                                        <Link
                                                            href={`/dashboard/my-listings/${listing.id}/edit`}
                                                            className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
                                                        >
                                                            {listing.status ===
                                                                "REJECTED"
                                                                ? "Resubmit"
                                                                : "Edit"}
                                                        </Link>

                                                    </div>

                                                </div>

                                                {/* REJECTION */}

                                                {listing.status ===
                                                    "REJECTED" && (
                                                        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

                                                            <p className="text-xs font-semibold text-red-700">
                                                                Rejection reason
                                                            </p>

                                                            <p className="mt-1 text-xs text-red-600">
                                                                {
                                                                    listing.rejectReason
                                                                }
                                                            </p>

                                                        </div>
                                                    )}

                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}