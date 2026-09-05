"use client";

import { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/api-config";
import Link from "next/link";

export default function AuctionsPage() {
    const [auctions, setAuctions] =
        useState<any[]>([]);

    useEffect(() => {
        const fetchAuctions =
            async () => {
                const token =
                    localStorage.getItem("token");

                const res = await fetch(
                    `${API_BASE_URL}/api/admin/auctions`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();

                setAuctions(
                    Array.isArray(data)
                        ? data
                        : []
                );
            };

        fetchAuctions();
    }, []);

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-8">
                Auctions
            </h1>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                {auctions.map((auction: any) => (

                    <Link
                        key={auction.id}
                        href={`/admin/auctions/${auction.id}`}
                        className="block"
                    >

                        <div className="bg-white border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">

                            {/* Auction image */}

                            <div className="relative">
                                {(() => {
                                    const listingImages =
                                        auction.listing?.images ||
                                        auction.listing?.listingimage ||
                                        [];

                                    const imageUrl =
                                        listingImages[0]?.imageUrl ||
                                        (typeof listingImages[0] ===
                                            "string"
                                            ? listingImages[0]
                                            : null);

                                    return imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={
                                                auction.listing
                                                    ?.title || "Auction"
                                            }
                                            className="w-full h-52 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-52 bg-gray-100 flex items-center justify-center text-gray-400">
                                            No image
                                        </div>
                                    );
                                })()}

                                {/* Approval status */}

                                <span
                                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${auction.listing?.isApproved
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {auction.listing?.isApproved
                                        ? "Approved"
                                        : "Pending Review"}
                                </span>
                            </div>
                            {/* Auction information */}
                            <div className="p-5">

                                <p className="text-sm text-gray-500 mb-2">

                                    {
                                        auction.listing
                                            ?.category?.name
                                    }

                                </p>

                                <h2 className="text-xl font-bold">

                                    {
                                        auction.listing
                                            ?.title
                                    }

                                </h2>

                                <div className="grid grid-cols-2 gap-4 mt-5">

                                    <div>

                                        <p className="text-sm text-gray-500">

                                            Starting Bid

                                        </p>

                                        <p className="font-bold">

                                            ₦
                                            {Number(
                                                auction.startingBid
                                            ).toLocaleString()}

                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm text-gray-500">

                                            Current Bid

                                        </p>

                                        <p className="font-bold">

                                            ₦
                                            {Number(
                                                auction.currentBid
                                            ).toLocaleString()}

                                        </p>

                                    </div>

                                </div>

                                <div className="border-t mt-5 pt-4">

                                    <p className="text-sm text-gray-500">

                                        Seller

                                    </p>

                                    <p className="font-semibold">

                                        {
                                            auction.listing?.seller?.name ||
                                            auction.listing?.user?.name ||
                                            "—"
                                        }

                                    </p>

                                </div>

                                <div className="mt-5 flex items-center justify-between">

                                    <span className="text-sm font-semibold text-blue-600">

                                        Review Auction →

                                    </span>

                                    <span className="text-xs text-gray-400">

                                        ID #{auction.id}

                                    </span>

                                </div>

                            </div>

                        </div>

                    </Link>

                ))}

            </div>
        </div>
    );
}