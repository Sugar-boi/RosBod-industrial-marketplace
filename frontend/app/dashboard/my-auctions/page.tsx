"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import API_BASE_URL from "@/lib/api-config";

export default function MyAuctionsPage() {
    const [auctions, setAuctions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                setLoading(true);
                setError(null);

                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Please log in to view your auctions.");
                    return;
                }

                const res = await fetch(
                    `${API_BASE_URL}/api/sellers/my-auctions`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.message || "Failed to load auctions"
                    );
                }

                setAuctions(Array.isArray(data) ? data : []);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to load auctions");
                setAuctions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAuctions();
    }, []);

    const getImage = (auction: any) => {
        const images =
            auction.listing?.images ||
            auction.listing?.listingimage ||
            [];
        return images[0]?.imageUrl || null;
    };

    const formatMoney = (n: number | string | null | undefined) =>
        `₦${Number(n || 0).toLocaleString()}`;

    const formatDate = (d?: string) => {
        if (!d) return "—";
        return new Date(d).toLocaleString("en-NG", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const statusStyles = (status?: string) => {
        const s = (status || "").toUpperCase();
        if (s === "LIVE")
            return "bg-green-50 text-green-700 border-green-200";
        if (s === "SCHEDULED")
            return "bg-blue-50 text-blue-700 border-blue-200";
        if (s === "ENDED" || s === "SOLD")
            return "bg-gray-100 text-gray-600 border-gray-200";
        return "bg-orange-50 text-orange-700 border-orange-200";
    };

    if (loading) {
        return (
            <div className="p-6 sm:p-8">
                <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-72 animate-pulse rounded-2xl bg-gray-200"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f5]">
            <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d97706]">
                            Seller workspace
                        </p>
                        <h1 className="mt-1 text-2xl font-extrabold text-[#24272b] sm:text-3xl">
                            My Auctions
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Track bids, timing, and status of your auction
                            listings.
                        </p>
                    </div>

                    <Link
                        href="/create-auction"
                        className="inline-flex items-center justify-center rounded-xl bg-[#ff9900] px-5 py-3 text-sm font-extrabold text-[#24272b] transition hover:bg-[#ffad28]"
                    >
                        + New Auction
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {!error && auctions.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                        <p className="text-lg font-bold text-[#24272b]">
                            No auctions yet
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            Create an auction from a new or existing listing.
                        </p>
                        <Link
                            href="/create-auction"
                            className="mt-6 inline-flex rounded-xl bg-[#ff9900] px-5 py-3 text-sm font-extrabold text-[#24272b] hover:bg-[#ffad28]"
                        >
                            Create auction
                        </Link>
                    </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {auctions.map((auction) => {
                        const image = getImage(auction);
                        const listingApproved =
                            auction.listing?.isApproved === true;

                        return (
                            <Link
                                key={auction.id}
                                href={`/auctions/${auction.id}`}
                                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-orange-200 hover:shadow-md"
                            >
                                <div className="relative h-44 bg-gray-100">
                                    {image ? (
                                        <img
                                            src={image}
                                            alt={
                                                auction.listing?.title ||
                                                "Auction"
                                            }
                                            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-gray-400">
                                            No image
                                        </div>
                                    )}

                                    <span
                                        className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusStyles(
                                            auction.status
                                        )}`}
                                    >
                                        {(auction.status || "UNKNOWN").toUpperCase()}
                                    </span>

                                    <span
                                        className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                            listingApproved
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-800"
                                        }`}
                                    >
                                        {listingApproved
                                            ? "Approved"
                                            : "Pending review"}
                                    </span>
                                </div>

                                <div className="p-4">
                                    <p className="text-[11px] font-medium text-gray-500">
                                        {auction.listing?.category?.name ||
                                            "Auction"}
                                    </p>
                                    <h2 className="mt-1 line-clamp-2 text-base font-bold text-[#24272b]">
                                        {auction.listing?.title ||
                                            "Untitled auction"}
                                    </h2>

                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div className="rounded-lg bg-[#fafaf9] p-3">
                                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                                Current bid
                                            </p>
                                            <p className="mt-1 text-sm font-extrabold text-[#24272b]">
                                                {formatMoney(
                                                    auction.currentBid
                                                )}
                                            </p>
                                        </div>
                                        <div className="rounded-lg bg-[#fafaf9] p-3">
                                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                                Starting
                                            </p>
                                            <p className="mt-1 text-sm font-extrabold text-[#24272b]">
                                                {formatMoney(
                                                    auction.startingBid
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
                                        <p>
                                            Starts:{" "}
                                            <span className="font-medium text-gray-700">
                                                {formatDate(
                                                    auction.startDate
                                                )}
                                            </span>
                                        </p>
                                        <p className="mt-1">
                                            Ends:{" "}
                                            <span className="font-medium text-gray-700">
                                                {formatDate(auction.endDate)}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}