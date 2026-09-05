"use client";

import { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/api-config";

export default function BidsPage() {
    const [bids, setBids] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_BASE_URL}/api/admin/bids`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setBids(Array.isArray(data) ? data : []);
            } catch {
                setBids([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[50vh] bg-[#f7f7f5] p-8">
                <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f5]">
            <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-extrabold text-[#202226] sm:text-3xl">
                    Bids
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    All bids placed across auctions.
                </p>

                <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px] text-left text-sm">
                            <thead className="bg-[#fafaf9] text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Item</th>
                                    <th className="px-4 py-3">Bidder</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {bids.map((bid) => (
                                    <tr key={bid.id} className="hover:bg-[#fffaf3]">
                                        <td className="px-4 py-3 font-semibold text-[#202226]">
                                            {bid.auction?.listing?.title || "—"}
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">
                                            {bid.bidder?.name ||
                                                bid.user?.name ||
                                                "—"}
                                        </td>
                                        <td className="px-4 py-3 font-bold">
                                            ₦{Number(bid.amount || 0).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {bid.createdAt
                                                ? new Date(bid.createdAt).toLocaleDateString("en-NG")
                                                : "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {bids.length === 0 && (
                        <p className="py-12 text-center text-sm text-gray-500">
                            No bids yet
                        </p>
                    )}
                </section>
            </div>
        </div>
    );
}