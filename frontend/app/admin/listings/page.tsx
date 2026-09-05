"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import API_BASE_URL from "@/lib/api-config";

export default function AdminListingsPage() {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");
                if (!token) {
                    setError("You are not logged in. Please sign in as admin.");
                    setListings([]);
                    return;
                }

                const res = await fetch(`${API_BASE_URL}/api/admin/listings`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to load listings");
                }

                // ALL listings — pending, approved, rejected
                setListings(Array.isArray(data) ? data : []);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to load listings");
                setListings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    const getStatus = (listing: any) => {
        if (listing.status === "REJECTED") return "Rejected";
        if (listing.status === "APPROVED" || listing.isApproved === true)
            return "Approved";
        return "Pending";
    };
    

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();

        return listings.filter((listing) => {
            const seller = listing.seller || listing.user;
            const status = getStatus(listing);

            const matchesSearch =
                !q ||
                listing.title?.toLowerCase().includes(q) ||
                seller?.name?.toLowerCase().includes(q) ||
                seller?.email?.toLowerCase().includes(q) ||
                listing.category?.name?.toLowerCase().includes(q);

            const matchesStatus =
                statusFilter === "all" || status.toLowerCase() === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [listings, search, statusFilter]);

    const formatPrice = (price: any) =>
        `₦${Number(price || 0).toLocaleString()}`;

    const formatDate = (date?: string) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("en-NG", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const statusBadge = (status: string) => {
        if (status === "Approved") return "bg-green-50 text-green-700";
        if (status === "Rejected") return "bg-red-50 text-red-700";
        return "bg-orange-50 text-orange-700";
    };

    if (loading) {
        return (
            <div className="min-h-[50vh] bg-[#f7f7f5] p-6 sm:p-8">
                <div className="mx-auto max-w-[1200px]">
                    <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
                    <div className="mt-3 h-4 w-72 animate-pulse rounded bg-gray-200" />
                    <div className="mt-8 h-96 animate-pulse rounded-xl border border-gray-200 bg-white" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f5]">
            <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-extrabold text-[#202226] sm:text-3xl">
                    All Listings
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Pending, approved, and rejected listings across the marketplace.
                </p>

                {error && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search title, seller, category..."
                        className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-[#ff9900] focus:ring-2 focus:ring-orange-100 sm:max-w-sm"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#ff9900] sm:w-44"
                    >
                        <option value="all">All statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                <p className="mt-4 text-xs text-gray-500">
                    Showing{" "}
                    <span className="font-bold text-gray-700">{filtered.length}</span> of{" "}
                    {listings.length} listings
                </p>

                <section className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead className="bg-[#fafaf9] text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Listing</th>
                                    <th className="px-4 py-3">Seller</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3">Price</th>
                                    <th className="px-4 py-3">Submitted</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((listing) => {
                                    const seller = listing.seller || listing.user;
                                    const status = getStatus(listing);

                                    return (
                                        <tr key={listing.id} className="hover:bg-[#fffaf3]">
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/listings/${listing.id}`}
                                                    className="font-bold text-[#202226] hover:text-[#d97706]"
                                                >
                                                    {listing.title || "Untitled"}
                                                </Link>
                                                {listing.isAuction && (
                                                    <span className="ml-2 rounded bg-orange-100 px-1.5 py-0.5 text-[9px] font-bold text-orange-700">
                                                        Auction
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-4 py-3 text-gray-700">
                                                {seller?.id ? (
                                                    <Link
                                                        href={`/sellers/${seller.id}`}
                                                        className="hover:text-[#d97706] hover:underline"
                                                    >
                                                        {seller.name || "—"}
                                                    </Link>
                                                ) : (
                                                    seller?.name || "—"
                                                )}
                                            </td>

                                            <td className="px-4 py-3 text-gray-500">
                                                {listing.category?.name || "—"}
                                            </td>

                                            <td className="px-4 py-3 font-bold text-[#202226]">
                                                <Link
                                                    href={`/listings/${listing.id}`}
                                                    className="hover:text-[#d97706]"
                                                >
                                                    {formatPrice(listing.price)}
                                                </Link>
                                            </td>

                                            <td className="px-4 py-3 text-gray-500">
                                                {formatDate(listing.createdAt)}
                                            </td>

                                            <td className="px-4 py-3">
                                                <Link href={`/listings/${listing.id}`}>
                                                    <span
                                                        className={`inline-flex rounded-md px-2 py-1 text-[10px] font-bold ${statusBadge(
                                                            status
                                                        )}`}
                                                    >
                                                        {status}
                                                    </span>
                                                </Link>
                                            </td>

                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/listings/${listing.id}`}
                                                    className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {filtered.length === 0 && (
                        <div className="px-6 py-16 text-center">
                            <p className="font-bold text-[#202226]">No listings found</p>
                            <p className="mt-1 text-sm text-gray-500">
                                Try another search or status filter.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}