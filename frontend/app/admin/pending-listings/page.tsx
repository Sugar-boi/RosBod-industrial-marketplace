"use client";

import Link from "next/link";
import API_BASE_URL from "@/lib/api-config";
import RejectListingModal from "@/components/RejectListingModal";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

type Listing = {
    id: number;
    title?: string;
    price?: number | string | null;
    createdAt?: string;
    status?: string;
    isApproved?: boolean;

    description?: string;

    seller?: {
        id?: number;
        name?: string;
        companyName?: string;
    };

    user?: {
        id?: number;
        name?: string;
        companyName?: string;
    };

    category?: {
        id?: number;
        name?: string;

        category?: {
            name?: string;
        };
    };

    images?: {
        id?: number;
        imageUrl?: string;
    }[];

    listingimage?: {
        id?: number;
        imageUrl?: string;
    }[];
    auction?: {
        id: number;
        status?: string;
        startDate?: string;
        endDate?: string;
    } | null;
};

type Stats = {
    totalListings?: number;
    pendingListings?: number;
    approvedListings?: number;
    rejectedListings?: number;
};

export default function PendingListingsPage() {
    const [listings, setListings] =
        useState<Listing[]>([]);

    const [stats, setStats] =
        useState<Stats | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [selectedCategory, setSelectedCategory] =
        useState("");

    const [selectedSeller, setSelectedSeller] =
        useState("");

    const [selectedDate, setSelectedDate] =
        useState("");

    const [activeTab, setActiveTab] =
        useState("all");

    const [selectedListing, setSelectedListing] =
        useState<number | null>(null);

    const [showRejectModal, setShowRejectModal] =
        useState(false);

    /* --------------------------------------------------
       FETCH PENDING LISTINGS
    -------------------------------------------------- */

    const fetchListings = async () => {
        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            const res = await fetch(
                `${API_BASE_URL}/api/admin/pending-listings`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data =
                await res.json();

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
        } catch (err: any) {
            console.error(err);

            setError(
                err.message ||
                "Failed to load listings"
            );

            setListings([]);
        } finally {
            setLoading(false);
        }
    };

    /* --------------------------------------------------
       FETCH ADMIN COUNTS
    -------------------------------------------------- */

    const fetchStats = async () => {
        try {
            const token =
                localStorage.getItem("token");

            const res = await fetch(
                `${API_BASE_URL}/api/admin/dashboard-stats`,
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

            setStats(data);
        } catch (err) {
            console.error(
                "Failed to fetch admin stats:",
                err
            );
        }
    };

    useEffect(() => {
        fetchListings();
        fetchStats();
    }, []);

    /* --------------------------------------------------
       NORMALIZE BACKEND DATA
    -------------------------------------------------- */

    const getSeller = (
        listing: Listing
    ) => {
        return (
            listing.seller ||
            listing.user ||
            null
        );
    };

    const getSellerName = (
        listing: Listing
    ) => {
        const seller =
            getSeller(listing);

        return (
            seller?.companyName ||
            seller?.name ||
            "Unknown Seller"
        );
    };

    const getCategoryName = (
        listing: Listing
    ) => {
        return (
            listing.category?.name ||
            listing.category?.category?.name ||
            "Uncategorized"
        );
    };

    const getImage = (
        listing: Listing
    ) => {
        const images =
            listing.images ||
            listing.listingimage ||
            [];

        return images[0]?.imageUrl || null;
    };

    const formatPrice = (
        price: number | string | null | undefined
    ) => {
        return `₦${Number(
            price || 0
        ).toLocaleString()}`;
    };

    const formatDate = (
        date?: string
    ) => {
        if (!date) {
            return "—";
        }

        return new Date(
            date
        ).toLocaleDateString(
            "en-NG",
            {
                month: "short",
                day: "numeric",
                year: "numeric",
            }
        );
    };

    /* --------------------------------------------------
       FILTER OPTIONS
    -------------------------------------------------- */

    const categories =
        useMemo(() => {
            return Array.from(
                new Set(
                    listings.map(
                        getCategoryName
                    )
                )
            ).sort();
        }, [listings]);

    const sellers =
        useMemo(() => {
            return Array.from(
                new Set(
                    listings.map(
                        getSellerName
                    )
                )
            ).sort();
        }, [listings]);

    /* --------------------------------------------------
       FILTER LISTINGS
    -------------------------------------------------- */

    const filteredListings =
        useMemo(() => {
            return listings.filter(
                (listing) => {
                    const searchValue =
                        search
                            .toLowerCase()
                            .trim();

                    const matchesSearch =
                        !searchValue ||
                        listing.title
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            ) ||
                        getSellerName(
                            listing
                        )
                            .toLowerCase()
                            .includes(
                                searchValue
                            );

                    const matchesCategory =
                        !selectedCategory ||
                        getCategoryName(
                            listing
                        ) ===
                            selectedCategory;

                    const matchesSeller =
                        !selectedSeller ||
                        getSellerName(
                            listing
                        ) ===
                            selectedSeller;

                    const matchesDate =
                        !selectedDate ||
                        (
                            listing.createdAt &&
                            new Date(
                                listing.createdAt
                            )
                                .toISOString()
                                .slice(
                                    0,
                                    10
                                ) ===
                                selectedDate
                        );

                    return (
                        matchesSearch &&
                        matchesCategory &&
                        matchesSeller &&
                        matchesDate
                    );
                }
            );
        }, [
            listings,
            search,
            selectedCategory,
            selectedSeller,
            selectedDate,
        ]);

    /* --------------------------------------------------
       APPROVE
    -------------------------------------------------- */

    const approveListing = async (
        id: number
    ) => {
        try {
            const token =
                localStorage.getItem(
                    "token"
                );

            const res = await fetch(
                `${API_BASE_URL}/api/admin/approve-listing/${id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                const data =
                    await res.json();

                throw new Error(
                    data.message ||
                    "Failed to approve listing"
                );
            }

            setListings(
                (current) =>
                    current.filter(
                        (listing) =>
                            listing.id !== id
                    )
            );

            fetchStats();
        } catch (err: any) {
            console.error(err);

            alert(
                err.message ||
                "Failed to approve listing"
            );
        }
    };

    /* --------------------------------------------------
       REJECT
    -------------------------------------------------- */

    const rejectListing = async (
        reason: string
    ) => {
        if (
            selectedListing === null
        ) {
            return;
        }

        try {
            const token =
                localStorage.getItem(
                    "token"
                );

            const res = await fetch(
                `${API_BASE_URL}/api/admin/reject-listing/${selectedListing}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        rejectReason:
                            reason,
                    }),
                }
            );

            if (!res.ok) {
                const data =
                    await res.json();

                throw new Error(
                    data.message ||
                    "Failed to reject listing"
                );
            }

            setShowRejectModal(
                false
            );

            setSelectedListing(
                null
            );

            await fetchListings();
            await fetchStats();
        } catch (err: any) {
            console.error(err);

            alert(
                err.message ||
                "Failed to reject listing"
            );
        }
    };

    /* --------------------------------------------------
       LOADING
    -------------------------------------------------- */

    if (loading) {
        return (
            <div className="min-h-[60vh] bg-[#f7f7f5] p-5 sm:p-8">
                <div className="mx-auto max-w-[1200px]">
                    <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />

                    <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-gray-200" />

                    <div className="mt-8 h-20 animate-pulse rounded-xl bg-white border border-gray-200" />

                    <div className="mt-4 h-96 animate-pulse rounded-xl bg-white border border-gray-200" />
                </div>
            </div>
        );
    }

    /* --------------------------------------------------
       ERROR
    -------------------------------------------------- */

    if (error) {
        return (
            <div className="min-h-[60vh] bg-[#f7f7f5] p-5 sm:p-8">
                <div className="mx-auto max-w-[1200px] rounded-xl border border-red-200 bg-red-50 p-6">
                    <h2 className="font-bold text-red-800">
                        Unable to load listings
                    </h2>

                    <p className="mt-1 text-sm text-red-700">
                        {error}
                    </p>

                    <button
                        onClick={() => {
                            fetchListings();
                            fetchStats();
                        }}
                        className="mt-4 rounded-lg bg-[#202226] px-4 py-2 text-sm font-bold text-white"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f5]">
            <main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">

                {/* HEADER */}

                <div className="mb-5">
                    <h1 className="text-2xl font-extrabold tracking-tight text-[#202226] sm:text-3xl">
                        Listings Management
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Review, approve, and manage marketplace listings
                    </p>
                </div>

                {/* FILTER BAR */}

                <section className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[2.3fr_1fr_1.2fr_1.2fr_1fr]">

                        {/* SEARCH */}

                        <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                ⌕
                            </span>

                            <input
                                type="text"
                                placeholder="Search listings, sellers..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-[#ff9900] focus:ring-2 focus:ring-orange-100"
                            />
                        </div>

                        {/* STATUS */}

                        <select
                            value={
                                activeTab === "pending"
                                    ? "Pending"
                                    : "All"
                            }
                            onChange={(e) => {
                                const value =
                                    e.target.value;

                                if (
                                    value ===
                                    "Pending"
                                ) {
                                    setActiveTab(
                                        "pending"
                                    );
                                } else {
                                    setActiveTab(
                                        "all"
                                    );
                                }
                            }}
                            className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#ff9900]"
                        >
                            <option value="All">
                                All Statuses
                            </option>

                            <option value="Pending">
                                Pending
                            </option>
                        </select>

                        {/* CATEGORY */}

                        <select
                            value={
                                selectedCategory
                            }
                            onChange={(e) =>
                                setSelectedCategory(
                                    e.target.value
                                )
                            }
                            className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#ff9900]"
                        >
                            <option value="">
                                All Categories
                            </option>

                            {categories.map(
                                (category) => (
                                    <option
                                        key={
                                            category
                                        }
                                        value={
                                            category
                                        }
                                    >
                                        {category}
                                    </option>
                                )
                            )}
                        </select>

                        {/* SELLER */}

                        <select
                            value={
                                selectedSeller
                            }
                            onChange={(e) =>
                                setSelectedSeller(
                                    e.target.value
                                )
                            }
                            className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#ff9900]"
                        >
                            <option value="">
                                All Sellers
                            </option>

                            {sellers.map(
                                (seller) => (
                                    <option
                                        key={
                                            seller
                                        }
                                        value={
                                            seller
                                        }
                                    >
                                        {seller}
                                    </option>
                                )
                            )}
                        </select>

                        {/* DATE */}

                        <input
                            type="date"
                            value={
                                selectedDate
                            }
                            onChange={(e) =>
                                setSelectedDate(
                                    e.target.value
                                )
                            }
                            className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#ff9900]"
                        />
                    </div>
                </section>

                {/* TABS */}

                <section className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">

                    <div className="flex overflow-x-auto border-b border-gray-200">

                        {[
                            {
                                key: "all",
                                label: "All",
                                count:
                                    stats?.totalListings ??
                                    listings.length,
                            },
                            {
                                key: "pending",
                                label: "Pending",
                                count:
                                    stats?.pendingListings ??
                                    listings.length,
                            },
                            {
                                key: "approved",
                                label: "Approved",
                                count:
                                    stats?.approvedListings ??
                                    0,
                            },
                            {
                                key: "rejected",
                                label: "Rejected",
                                count:
                                    stats?.rejectedListings ??
                                    0,
                            },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() =>
                                    setActiveTab(
                                        tab.key
                                    )
                                }
                                className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition sm:px-5 ${
                                    activeTab ===
                                    tab.key
                                        ? "border-[#ff9900] text-[#202226]"
                                        : "border-transparent text-gray-500 hover:text-gray-800"
                                }`}
                            >
                                {tab.label}

                                <span
                                    className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold ${
                                        activeTab ===
                                        tab.key
                                            ? "bg-orange-50 text-[#d97706]"
                                            : "bg-gray-100 text-gray-500"
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* TABLE HEADER */}

                    <div className="hidden overflow-x-auto lg:block">

                        <div className="min-w-[950px]">

                            <div className="grid grid-cols-[2.5fr_1.25fr_1.1fr_1fr_1.1fr_1fr_1.1fr] border-b border-gray-100 bg-[#fafaf9] px-4 py-3 text-[10px] font-extrabold uppercase tracking-wider text-gray-500">

                                <span>
                                    Listing
                                </span>

                                <span>
                                    Seller
                                </span>

                                <span>
                                    Category
                                </span>

                                <span>
                                    Price
                                </span>

                                <span>
                                    Submitted
                                </span>

                                <span>
                                    Status
                                </span>

                                <span>
                                    Actions
                                </span>

                            </div>

                            {/* DESKTOP ROWS */}

                            {filteredListings.length ===
                            0 ? (
                                <EmptyState />
                            ) : (
                                filteredListings.map(
                                    (
                                        listing
                                    ) => {
                                        const image =
                                            getImage(
                                                listing
                                            );

                                        return (
                                            <div
                                                key={
                                                    listing.id
                                                }
                                                className="grid grid-cols-[2.5fr_1.25fr_1.1fr_1fr_1.1fr_1fr_1.1fr] items-center border-b border-gray-100 px-4 py-3 transition last:border-b-0 hover:bg-[#fffaf3]"
                                            >

                                                {/* LISTING */}

                                                <div className="flex min-w-0 items-center gap-3">

                                                    <div className="h-11 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                                        {image ? (
                                                            <img
                                                                src={
                                                                    image
                                                                }
                                                                alt={
                                                                    listing.title ||
                                                                    "Listing"
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                                                No image
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">

                                                        <div className="flex items-center gap-2">

                                                            <Link
                                                                href={`/listings/${listing.id}`}
                                                                className="truncate text-sm font-bold text-[#202226] hover:text-[#d97706]"
                                                            >
                                                                {
                                                                    listing.title ||
                                                                    "Untitled Listing"
                                                                }
                                                            </Link>

                                                            {listing.auction && (
                                                                <span className="hidden shrink-0 rounded bg-orange-100 px-1.5 py-0.5 text-[9px] font-bold text-orange-700 xl:inline">
                                                                    Auction
                                                                </span>
                                                            )}

                                                        </div>


                                                        <p className="mt-1 truncate text-[11px] text-gray-500">
                                                            {getCategoryName(
                                                                listing
                                                            )}
                                                        </p>

                                                    </div>

                                                </div>

                                                {/* SELLER */}

                                                <div className="truncate pr-3 text-sm font-medium text-gray-700">
                                                    {getSellerName(
                                                        listing
                                                    )}
                                                </div>

                                                {/* CATEGORY */}

                                                <div className="truncate pr-3 text-xs text-gray-500">
                                                    {getCategoryName(
                                                        listing
                                                    )}
                                                </div>

                                                {/* PRICE */}

                                                <div className="text-sm font-bold text-[#202226]">
                                                    {formatPrice(
                                                        listing.price
                                                    )}
                                                </div>

                                                {/* DATE */}

                                                <div className="text-xs text-gray-500">
                                                    {formatDate(
                                                        listing.createdAt
                                                    )}
                                                </div>

                                                {/* STATUS */}

                                                <div>
                                                    <span className="inline-flex rounded-md bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-700">
                                                        Pending
                                                    </span>
                                                </div>

                                                {/* ACTIONS */}

                                                <div className="flex items-center gap-1.5">

                                                    <Link
                                                        href={`/listings/${listing.id}`}
                                                        className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                                                    >
                                                        View
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            approveListing(
                                                                listing.id
                                                            )
                                                        }
                                                        className="rounded-md bg-[#16a34a] px-2.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#15803d]"
                                                    >
                                                        Approve
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedListing(
                                                                listing.id
                                                            );

                                                            setShowRejectModal(
                                                                true
                                                            );
                                                        }}
                                                        className="rounded-md border border-red-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                                    >
                                                        Reject
                                                    </button>

                                                </div>

                                            </div>
                                        );
                                    }
                                )
                            )}

                        </div>

                    </div>

                    {/* TABLET */}

                    <div className="hidden overflow-x-auto md:block lg:hidden">

                        <div className="min-w-[850px]">

                            <div className="grid grid-cols-[2.3fr_1.2fr_1fr_1fr_1fr_1.5fr] border-b border-gray-100 bg-[#fafaf9] px-4 py-3 text-[10px] font-extrabold uppercase tracking-wider text-gray-500">

                                <span>
                                    Listing
                                </span>

                                <span>
                                    Seller
                                </span>

                                <span>
                                    Category
                                </span>

                                <span>
                                    Price
                                </span>

                                <span>
                                    Status
                                </span>

                                <span>
                                    Actions
                                </span>

                            </div>

                            {filteredListings.map(
                                (listing) => {
                                    const image =
                                        getImage(
                                            listing
                                        );

                                    return (
                                        <div
                                            key={
                                                listing.id
                                            }
                                            className="grid grid-cols-[2.3fr_1.2fr_1fr_1fr_1fr_1.5fr] items-center border-b border-gray-100 px-4 py-4"
                                        >

                                            <div className="flex items-center gap-3">

                                                <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                                    {image ? (
                                                        <img
                                                            src={
                                                                image
                                                            }
                                                            alt=""
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
                                                            No image
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <Link
                                                        href={`/listings/${listing.id}`}
                                                        className="block truncate text-sm font-bold text-[#202226]"
                                                    >
                                                        {
                                                            listing.title
                                                        }
                                                    </Link>

                                                    <p className="mt-1 truncate text-[11px] text-gray-500">
                                                        {formatDate(
                                                            listing.createdAt
                                                        )}
                                                    </p>
                                                </div>

                                            </div>

                                            <span className="truncate text-sm">
                                                {getSellerName(
                                                    listing
                                                )}
                                            </span>

                                            <span className="truncate text-xs text-gray-500">
                                                {getCategoryName(
                                                    listing
                                                )}
                                            </span>

                                            <span className="text-sm font-bold">
                                                {formatPrice(
                                                    listing.price
                                                )}
                                            </span>

                                            <span className="w-fit rounded-md bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-700">
                                                Pending
                                            </span>

                                            <div className="flex gap-2">

                                                <Link
                                                    href={`/listings/${listing.id}`}
                                                    className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-semibold"
                                                >
                                                    View
                                                </Link>

                                                <button
                                                    onClick={() =>
                                                        approveListing(
                                                            listing.id
                                                        )
                                                    }
                                                    className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-bold text-white"
                                                >
                                                    Approve
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setSelectedListing(
                                                            listing.id
                                                        );

                                                        setShowRejectModal(
                                                            true
                                                        );
                                                    }}
                                                    className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600"
                                                >
                                                    Reject
                                                </button>

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    </div>

                    {/* MOBILE */}

                    <div className="md:hidden">

                        {filteredListings.length ===
                        0 ? (
                            <EmptyState />
                        ) : (
                            <div className="divide-y divide-gray-100">

                                {filteredListings.map(
                                    (
                                        listing
                                    ) => {
                                        const image =
                                            getImage(
                                                listing
                                            );

                                        return (
                                            <div
                                                key={
                                                    listing.id
                                                }
                                                className="p-4"
                                            >

                                                <div className="flex gap-3">

                                                    <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">

                                                        {image ? (
                                                            <img
                                                                src={
                                                                    image
                                                                }
                                                                alt={
                                                                    listing.title ||
                                                                    ""
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
                                                                No image
                                                            </div>
                                                        )}

                                                    </div>

                                                    <div className="min-w-0 flex-1">

                                                        <Link
                                                            href={`/listings/${listing.id}`}
                                                            className="line-clamp-2 text-sm font-bold text-[#202226]"
                                                        >
                                                            {
                                                                listing.title
                                                            }
                                                        </Link>

                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {getSellerName(
                                                                listing
                                                            )}
                                                        </p>

                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {getCategoryName(
                                                                listing
                                                            )}
                                                        </p>

                                                    </div>

                                                </div>

                                                <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-[#fafaf9] p-3">

                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                                            Price
                                                        </p>

                                                        <p className="mt-1 text-sm font-bold text-[#202226]">
                                                            {formatPrice(
                                                                listing.price
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                                            Submitted
                                                        </p>

                                                        <p className="mt-1 text-xs text-gray-600">
                                                            {formatDate(
                                                                listing.createdAt
                                                            )}
                                                        </p>
                                                    </div>

                                                </div>

                                                <div className="mt-3 flex items-center justify-between gap-3">

                                                    <span className="rounded-md bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-700">
                                                        Pending
                                                    </span>

                                                    <div className="flex gap-2">

                                                        <Link
                                                            href={`/listings/${listing.id}`}
                                                            className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700"
                                                        >
                                                            View
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                approveListing(
                                                                    listing.id
                                                                )
                                                            }
                                                            className="rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white"
                                                        >
                                                            Approve
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedListing(
                                                                    listing.id
                                                                );

                                                                setShowRejectModal(
                                                                    true
                                                                );
                                                            }}
                                                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
                                                        >
                                                            Reject
                                                        </button>

                                                    </div>

                                                </div>

                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        )}

                    </div>

                </section>

                {/* RESULT COUNT */}

                <div className="flex items-center justify-between px-1 py-4">

                    <p className="text-xs text-gray-500">
                        Showing{" "}
                        <span className="font-bold text-gray-700">
                            {filteredListings.length}
                        </span>{" "}
                        pending{" "}
                        {filteredListings.length ===
                        1
                            ? "listing"
                            : "listings"}
                    </p>

                </div>

            </main>

            {/* REJECT MODAL */}

            <RejectListingModal
                open={
                    showRejectModal
                }
                onClose={() => {
                    setShowRejectModal(
                        false
                    );

                    setSelectedListing(
                        null
                    );
                }}
                onSubmit={
                    rejectListing
                }
            />
        </div>
    );
}

/* --------------------------------------------------
   EMPTY STATE
-------------------------------------------------- */

function EmptyState() {
    return (
        <div className="px-6 py-16 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
                ✓
            </div>

            <h3 className="mt-4 text-sm font-bold text-[#202226]">
                No listings found
            </h3>

            <p className="mt-1 text-xs text-gray-500">
                There are no listings matching your current filters.
            </p>

        </div>
    );
}