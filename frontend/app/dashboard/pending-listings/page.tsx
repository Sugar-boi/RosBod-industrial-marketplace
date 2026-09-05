"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import API_BASE_URL from "@/lib/api-config";

export default function PendingListingsPage() {
    const [listings, setListings] = useState<any[]>([]);



    const getPendingListings = async () => {
        const token =
            localStorage.getItem("token");

        const res = await fetch(
            `${API_BASE_URL}/api/sellers/my-listings`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

        const data =
            await res.json();

        const pending =
            Array.isArray(data)
                ? data.filter(
                    (listing) =>
                        listing.status === "PENDING"
                )
                : [];

        setListings(pending);
    };

    const rejectListing = async (id: number) => {
    const token =
        localStorage.getItem("token");

    const res = await fetch(
        `${API_BASE_URL}/api/listings/${id}/reject`,
        {
            method: "PUT",
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        }
    );

    if (res.ok) {
        alert("Listing rejected");
        getPendingListings();
    }
};





    useEffect(() => {
        getPendingListings();
    }, []);


    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">
                Pending Listings
            </h1>

            {listings.length === 0 && <p>No pending listings.</p>}

            {listings.map((listing) => (
                <div
    key={listing.id}
    className="border rounded-xl p-5 mb-6"
>
    {listing.images?.[0] && (
        <img
            src={listing.images[0].imageUrl}
            alt={listing.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
        />
    )}

    <h2 className="text-2xl font-bold">
        {listing.title}
    </h2>

    <p className="mt-2 text-gray-600">
        {listing.description}
    </p>

    <div className="mt-4 space-y-1">
        <p>
            <strong>Seller:</strong>{" "}
            {listing.seller?.name}
        </p>

        <p>
            <strong>Category:</strong>{" "}
            {listing.category?.name}
        </p>

        <p>
            <strong>Price:</strong> ₦
            {listing.price.toLocaleString()}
        </p>

        <p>
            <strong>Type:</strong>{" "}
            {listing.isAuction
                ? "Auction"
                : "Buy Now"}
        </p>

        <p>
            <strong>Submitted:</strong>{" "}
            {new Date(
                listing.createdAt
            ).toLocaleDateString()}
        </p>
    </div>

    <Link
    href={`/listings/${listing.id}`}
    className="bg-blue-600 text-white px-4 py-2 rounded"
>
    View Listing
</Link>
</div>
            ))}
        </div>
    );
}