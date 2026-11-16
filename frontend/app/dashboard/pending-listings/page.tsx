"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import API_BASE_URL from "@/lib/api-config";

export default function SellerPendingListingsPage() {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getPendingListings = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");
            if (!token) {
                setError("Please log in again.");
                setListings([]);
                return;
            }

            const res = await fetch(
                `${API_BASE_URL}/api/sellers/my-listings`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to load listings");
            }

            const pending = Array.isArray(data)
                ? data.filter(
                    (listing) =>
                        listing.status === "PENDING" ||
                        (listing.isApproved === false &&
                            listing.status !== "REJECTED")
                )
                : [];

            setListings(pending);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to load pending listings");
            setListings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPendingListings();
    }, []);

    const getImage = (listing: any) => {
        const images = listing.images || listing.listingimage || [];
        return images[0]?.imageUrl || null;
    };

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

    if (loading) {
        return (
            <div className="min-h-[50vh] bg-[#f7f7f5] p-6 sm:p-8">
                <div className="mx-auto max-w-5xl">
                    <div className="h-8 w-56 animate-pulse rounded bg-gray-200" />
                    <div className="mt-6 h-40 animate-pulse rounded-2xl border border-gray-200 bg-white" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f5]">
            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d97706]">
                            Seller dashboard
                        </p>
                        <h1 className="mt-1 text-2xl font-extrabold text-[#24272b] sm:text-3xl">
                            Pending Listings
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Listings waiting for admin approval before they go live.
                        </p>
                    </div>

                    <Link
                        href="/create-listing"
                        className="inline-flex items-center justify-center rounded-xl bg-[#ff9900] px-4 py-2.5 text-sm font-extrabold text-[#24272b] transition hover:bg-[#ffad28]"
                    >
                        + New listing
                    </Link>
                </div>

                {error && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {listings.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-lg">
                            ✓
                        </div>
                        <h2 className="mt-4 text-base font-bold text-[#24272b]">
                            No pending listings
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            When you submit a listing, it will appear here until an admin
                            reviews it.
                        </p>
                        <Link
                            href="/create-listing"
                            className="mt-5 inline-flex rounded-xl bg-[#ff9900] px-5 py-2.5 text-sm font-extrabold text-[#24272b]"
                        >
                            Create a listing
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-xs text-gray-500">
                            Showing{" "}
                            <span className="font-bold text-gray-700">
                                {listings.length}
                            </span>{" "}
                            pending {listings.length === 1 ? "listing" : "listings"}
                        </p>

                        {listings.map((listing) => {
                            const image = getImage(listing);

                            return (
                                <article
                                    key={listing.id}
                                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                                >
                                    <div className="grid gap-0 sm:grid-cols-[180px_1fr]">
                                        {/* Image */}
                                        <div className="h-44 bg-gray-100 sm:h-full sm:min-h-[160px]">
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={listing.title || "Listing"}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full min-h-[160px] items-center justify-center text-xs text-gray-400">
                                                    No image
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-col p-4 sm:p-5">
                                            <div className="flex flex-wrap items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h2 className="truncate text-lg font-extrabold text-[#24272b]">
                                                            {listing.title || "Untitled listing"}
                                                        </h2>
                                                        {listing.isAuction && (
                                                            <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[9px] font-bold text-orange-700">
                                                                Auction
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                                                        {listing.description || "No description"}
                                                    </p>
                                                </div>

                                                <span className="shrink-0 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[10px] font-bold text-orange-700">
                                                    Pending
                                                </span>
                                            </div>

                                            <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                                        Price
                                                    </p>
                                                    <p className="mt-0.5 font-bold text-[#24272b]">
                                                        {formatPrice(listing.price)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                                        Category
                                                    </p>
                                                    <p className="mt-0.5 font-semibold text-gray-700">
                                                        {listing.category?.name || "—"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                                        Type
                                                    </p>
                                                    <p className="mt-0.5 font-semibold text-gray-700">
                                                        {listing.isAuction ? "Auction" : "Fixed price"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                                        Submitted
                                                    </p>
                                                    <p className="mt-0.5 font-semibold text-gray-700">
                                                        {formatDate(listing.createdAt)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <Link
                                                    href={`/dashboard/my-listings/${listing.id}`}
                                                    className="rounded-lg bg-[#ff9900] px-4 py-2 text-xs font-extrabold text-[#24272b] transition hover:bg-[#ffad28]"
                                                >
                                                    Manage
                                                </Link>
                                                <Link
                                                    href={`/listings/${listing.id}`}
                                                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                                                >
                                                    Public view
                                                </Link>
                                                <Link
                                                    href={`/dashboard/my-listings/${listing.id}/edit`}
                                                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                                                >
                                                    Edit
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import API_BASE_URL from "@/lib/api-config";

// export default function PendingListingsPage() {
//     const [listings, setListings] = useState<any[]>([]);



//     const getPendingListings = async () => {
//         const token =
//             localStorage.getItem("token");

//         const res = await fetch(
//             `${API_BASE_URL}/api/sellers/my-listings`,
//             {
//                 headers: {
//                     Authorization:
//                         `Bearer ${token}`,
//                 },
//             }
//         );

//         const data =
//             await res.json();

//         const pending =
//             Array.isArray(data)
//                 ? data.filter(
//                     (listing) =>
//                         listing.status === "PENDING"
//                 )
//                 : [];

//         setListings(pending);
//     };

//     const rejectListing = async (id: number) => {
//     const token =
//         localStorage.getItem("token");

//     const res = await fetch(
//         `${API_BASE_URL}/api/listings/${id}/reject`,
//         {
//             method: "PUT",
//             headers: {
//                 Authorization:
//                     `Bearer ${token}`,
//             },
//         }
//     );

//     if (res.ok) {
//         alert("Listing rejected");
//         getPendingListings();
//     }
// };





//     useEffect(() => {
//         getPendingListings();
//     }, []);


//     return (
//         <div className="p-8">
//             <h1 className="text-3xl font-bold mb-6">
//                 Pending Listings
//             </h1>

//             {listings.length === 0 && <p>No pending listings.</p>}

//             {listings.map((listing) => (
//                 <div
//     key={listing.id}
//     className="border rounded-xl p-5 mb-6"
// >
//     {listing.images?.[0] && (
//         <img
//             src={listing.images[0].imageUrl}
//             alt={listing.title}
//             className="w-full h-64 object-cover rounded-lg mb-4"
//         />
//     )}

//     <h2 className="text-2xl font-bold">
//         {listing.title}
//     </h2>

//     <p className="mt-2 text-gray-600">
//         {listing.description}
//     </p>

//     <div className="mt-4 space-y-1">
//         <p>
//             <strong>Seller:</strong>{" "}
//             {listing.seller?.name}
//         </p>

//         <p>
//             <strong>Category:</strong>{" "}
//             {listing.category?.name}
//         </p>

//         <p>
//             <strong>Price:</strong> ₦
//             {listing.price.toLocaleString()}
//         </p>

//         <p>
//             <strong>Type:</strong>{" "}
//             {listing.isAuction
//                 ? "Auction"
//                 : "Buy Now"}
//         </p>

//         <p>
//             <strong>Submitted:</strong>{" "}
//             {new Date(
//                 listing.createdAt
//             ).toLocaleDateString()}
//         </p>
//     </div>

//     <Link
//     href={`/listings/${listing.id}`}
//     className="bg-blue-600 text-white px-4 py-2 rounded"
// >
//     View Listing
// </Link>
// </div>
//             ))}
//         </div>
//     );
// }