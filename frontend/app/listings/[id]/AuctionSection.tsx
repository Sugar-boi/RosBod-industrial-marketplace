"use client";

import { useState } from "react";
import BidForm from "./BidForm";

export default function AuctionSection({
    auction,
}: {
    auction: any;
}) {
    const [currentBid, setCurrentBid] =
        useState(auction.currentBid);

    return (
        <>
            <div className="border p-4 rounded mb-4">
                <h2 className="font-bold text-xl">
                    Current Bid
                </h2>

                <p className="text-2xl">
                    ₦{currentBid.toLocaleString()}
                </p>
            </div>

            <BidForm
                auction={{
                    ...auction,
                    currentBid,
                }}
                onBidPlaced={(newAmount) =>
                    setCurrentBid(newAmount)
                }
            />
        </>
    );
}