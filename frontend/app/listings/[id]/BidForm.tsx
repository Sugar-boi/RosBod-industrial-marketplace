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

    const placeBid = async () => {
        try {
            setLoading(true);

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${API_BASE_URL}/api/auctions/${auction.id}/bid`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        amount: Number(amount),
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Bid placed successfully");
onBidPlaced(Number(amount));
            setAmount("");
            // window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Failed to place bid");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6 border p-4 rounded">
            <h2 className="text-xl font-bold mb-2">
                🔨 Auction
            </h2>

            <p>
                Current Bid: ₦
                {auction.currentBid.toLocaleString()}
            </p>

            <p>
                Starting Bid: ₦
                {auction.startingBid.toLocaleString()}
            </p>

            <input
                type="number"
                value={amount}
                onChange={(e) =>
                    setAmount(e.target.value)
                }
                placeholder="Enter bid amount"
                className="border p-2 rounded w-full mt-3"
            />
            

            <button
                onClick={placeBid}
                disabled={loading}
                className="bg-black text-white px-4 py-2 rounded mt-3"
            >
                {loading
                    ? "Placing Bid..."
                    : "Place Bid"}
            </button>
        </div>
    );
}