"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import API_BASE_URL from "@/lib/api-config";
export default function AuctionPage() {

    const [auctions, setAuctions] =
        useState<any[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const res = await fetch(
                    `${API_BASE_URL}/api/auctions`
                );
                if (!res.ok) {
                    throw new Error(
                        "Failed to load auctions"
                    );
                }

                const data = await res.json();
                setAuctions(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAuctions();
    }, []);

    if (loading) {
        return (
            <div className="p-10">
                Loading auctions...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-10">
            <div className="mb-10">
                <h1 className="text-5xl font-bold">
                    Auctions Marketplace
                </h1>
                <p className="text-gray-600 mt-3">
                    Browse heavy equipment, quarry assets,
                    and industrial property auctions.
                </p>
            </div>
            {auctions.length === 0 ? (
                <div className="border rounded-xl p-10 text-center">
                    <h2 className="text-2xl font-bold">
                        No auctions available
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Check back later for new auctions.
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-6">
                    {auctions.map(
                        (auction: any) => {
                            const now =
                                new Date();
                            const startDate =
                                new Date(
                                    auction.startDate
                                );

                            const endDate =
                                new Date(
                                    auction.endDate
                                );

                            let status =
                                "LIVE";

                            let statusStyle =
                                "bg-green-100 text-green-700";

                            if (
                                auction.listing?.isSold
                            ) {
                                status =
                                    "SOLD";
                                statusStyle =
                                    "bg-purple-100 text-purple-700";
                            } else if (
                                now < startDate
                            ) {
                                status =
                                    "UPCOMING";
                                statusStyle =
                                    "bg-blue-100 text-blue-700";
                            } else if (
                                now > endDate
                            ) {
                                status =
                                    "ENDED";
                                statusStyle =
                                    "bg-red-100 text-red-700";
                            }
                            return (
                                <Link
                                    key={auction.id}
                                    href={`/auctions/${auction.id}`}
                                >
                                    <div
                                        className="border rounded-xl overflow-hidden hover:shadow-lg transition"
                                    >
                                        {auction.listing
                                            ?.images?.[0] && (
                                                <img
                                                    src={
                                                        auction
                                                            .listing
                                                            .images[0]
                                                            .imageUrl
                                                    }
                                                    alt={
                                                        auction
                                                            .listing
                                                            .title
                                                    }
                                                    className="w-full h-56 object-cover"
                                                />
                                            )}
                                        <div className="p-5">
                                            <div
                                                className="flex justify-between items-start gap-3"
                                            >
                                                <h3
                                                    className="font-bold text-lg"
                                                >
                                                    {
                                                        auction
                                                            .listing
                                                            ?.title
                                                    }
                                                </h3>
                                                <span
                                                    className={
                                                        `px-3 py-1 rounded-full ` +
                                                        `text-xs font-bold ${statusStyle}`
                                                    }
                                                >
                                                    {status}
                                                </span>
                                            </div>
                                            <p
                                                className="text-sm text-gray-500 mt-2"
                                            >
                                                {
                                                    auction
                                                        .listing
                                                        ?.category
                                                        ?.name
                                                }
                                            </p>
                                            <div
                                                className="mt-5"
                                            >
                                                <p
                                                    className="text-sm text-gray-500"
                                                >
                                                    Current Bid
                                                </p>
                                                <p
                                                    className="text-2xl font-bold"
                                                >
                                                    ₦
                                                    {
                                                        auction
                                                            .currentBid
                                                            ?.toLocaleString()
                                                    }
                                                </p>
                                            </div>
                                            <p
                                                className="text-sm text-gray-500 mt-4"
                                            >
                                                Ends:
                                                {" "}
                                                {
                                                    endDate
                                                        .toLocaleString()
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        }
                    )}
                </div>
            )}
        </div>
    );
}