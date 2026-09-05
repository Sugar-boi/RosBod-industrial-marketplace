"use client";

import { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/api-config";

export default function BuyerDashboard() {
    const [stats, setStats] = useState({
        saved: 0,
        activeBids: 0,
        wonAuctions: 0,
        notifications: 0,
    });

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch(
            `${API_BASE_URL}/api/buyer/dashboard`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await res.json();

        setStats(data);
    };

    return (
        <div className="p-10">

            <h1 className="text-4xl font-bold mb-10">
                Buyer Dashboard
            </h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                <div className="border rounded-xl p-6">
                    <h2 className="text-gray-500">
                        Saved Listings
                    </h2>

                    <p className="text-4xl font-bold mt-3">
                        {stats.saved}
                    </p>
                </div>

                <div className="border rounded-xl p-6">
                    <h2 className="text-gray-500">
                        Active Bids
                    </h2>

                    <p className="text-4xl font-bold mt-3">
                        {stats.activeBids}
                    </p>
                </div>

                <div className="border rounded-xl p-6">
                    <h2 className="text-gray-500">
                        Won Auctions
                    </h2>

                    <p className="text-4xl font-bold mt-3">
                        {stats.wonAuctions}
                    </p>
                </div>

                <div className="border rounded-xl p-6">
                    <h2 className="text-gray-500">
                        Notifications
                    </h2>

                    <p className="text-4xl font-bold mt-3">
                        {stats.notifications}
                    </p>
                </div>

            </div>

        </div>
    );
}