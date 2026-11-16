"use client";

import { useState } from "react";
import API_BASE_URL from "@/lib/api-config";

export default function BidForm({
    auction,
    onBidPlaced,
}: {
    auction: any;
    onBidPlaced: (amount: number) => void;
}) {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const placeBid = async () => {
        try {
            setLoading(true);
            setMessage(null);

            const token = localStorage.getItem("token");
            if (!token) {
                setMessage({ type: "error", text: "Please log in to place a bid." });
                return;
            }

            if (!amount) {
                setMessage({ type: "error", text: "Enter your bid amount." });
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/api/auctions/${auction.id}/bid`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ amount: Number(amount) }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage({
                    type: "error",
                    text: data.message || "Failed to place bid",
                });
                return;
            }

            setMessage({ type: "success", text: "Bid placed successfully." });
            onBidPlaced(Number(amount));
            setAmount("");
        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: "Failed to place bid" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-extrabold text-[#24272b]">Place a bid</h2>

            <p className="mt-2 text-sm text-gray-600">
                Current bid:{" "}
                <span className="font-bold text-[#24272b]">
                    ₦{Number(auction.currentBid || 0).toLocaleString()}
                </span>
            </p>
            <p className="text-sm text-gray-600">
                Starting bid:{" "}
                <span className="font-bold text-[#24272b]">
                    ₦{Number(auction.startingBid || 0).toLocaleString()}
                </span>
            </p>

            {message && (
                <div
                    className={`mt-3 rounded-lg px-3 py-2 text-sm ${message.type === "success"
                            ? "border border-green-200 bg-green-50 text-green-800"
                            : "border border-red-200 bg-red-50 text-red-700"
                        }`}
                >
                    {message.text}
                </div>
            )}

            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter bid amount"
                className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#ff9900]"
            />

            <button
                type="button"
                onClick={placeBid}
                disabled={loading}
                className="mt-3 w-full rounded-lg bg-[#ff9900] px-4 py-2.5 text-sm font-extrabold text-[#24272b] disabled:opacity-50"
            >
                {loading ? "Placing bid..." : "Place bid"}
            </button>
        </div>
    );
}