// "use client";

// import { useEffect, useState } from "react";
// import {
//     useParams,
//     useRouter,
// } from "next/navigation";
// import API_BASE_URL from "@/lib/api-config";

// export default function ListingDetailsPage() {

//     const params = useParams();
//     const router = useRouter();
//     const id = Array.isArray(params.id)
//         ? params.id[0]
//         : params.id;

//     const [listing, setListing] =
//         useState<any>(null);
//     const [currentImage, setCurrentImage] =
//         useState(0);

//     // const [isEditing, setIsEditing] =
//     //     useState(false);

//     // const [formData, setFormData] =
//     //     useState({
//     //         title: "",
//     //         description: "",
//     //         price: "",
//     //         categoryId: "",
//     //     });

//     useEffect(() => {
//         if (!id) return;
//         const fetchListing = async () => {
//             try {
//                 const token =
//                     localStorage.getItem(
//                         "token"
//                     );
//                 console.log("ID:", id);
//                 const res = await fetch(
//                     `${API_BASE_URL}/api/sellers/my-listings/${id}`,
//                     {
//                         headers: {
//                             Authorization:
//                                 `Bearer ${token}`,
//                         },
//                     }
//                 );

//                 const data =
//                     await res.json();

//                 console.log(data);
//                 setListing(data);

//                 // setFormData({
//                 //     title: data.title,
//                 //     description: data.description,
//                 //     price: data.price,
//                 //     categoryId: data.categoryId,
//                 // });
//             } catch (error) {
//                 console.error(error);
//             }
//         };

//         fetchListing();
//     }, [id]);

//     const deleteListing = async () => {

//         if (
//             !confirm(
//                 "Delete this listing permanently?"
//             )
//         ) {
//             return;
//         }

//         const token = localStorage.getItem("token");

//         const res = await fetch(
//             `${API_BASE_URL}/api/listings/${listing.id}`,
//             {
//                 method: "DELETE",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );

//         if (!res.ok) {
//             alert("Failed to delete.");
//             return;
//         }

//         alert("Listing deleted.");

//         window.location.href =
//             "/dashboard/my-listings";
//     };

//     // const saveChanges = async () => {
//     //     try {
//     //         const token =
//     //             localStorage.getItem("token");

//     //         const res = await fetch(
//     //             `${API_BASE_URL}/api/sellers/my-listings/${id}`,
//     //             {
//     //                 method: "PUT",
//     //                 headers: {
//     //                     "Content-Type":
//     //                         "application/json",
//     //                     Authorization:
//     //                         `Bearer ${token}`,
//     //                 },
//     //                 body: JSON.stringify(formData),
//     //             }
//     //         );

//     //         const data =
//     //             await res.json();

//     //         if (res.ok) {
//     //             setListing(data);
//     //             setIsEditing(false);

//     //             alert(
//     //                 "Listing updated successfully"
//     //             );
//     //         } else {
//     //             alert(data.message);
//     //         }
//     //     } catch (error) {
//     //         console.error(error);
//     //     }
//     // };

//     const markAsSold = async () => {

//         if (!confirm("Mark this listing as sold?")) {
//             return;
//         }

//         const token = localStorage.getItem("token");

//         const res = await fetch(
//             `${API_BASE_URL}/api/listings/${listing.id}/sold`,
//             {
//                 method: "PUT",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );

//         const data = await res.json();

//         if (!res.ok) {
//             alert(data.message);
//             return;
//         }

//         alert("Listing marked as sold.");

//         setListing(data);
//     };

//     if (!listing) {
//         return (
//             <div className="p-10">
//                 Loading...
//             </div>
//         );
//     }

//     return (
//         <div className="p-10">
//             <h1 className="text-4xl font-bold mb-4">
//                 {listing.title}
//             </h1>

//             <p className="mb-4 text-gray-700">
//                 {listing.description}
//             </p>

//             <p>
//                 Price: ${listing.price}
//             </p>

//             <p>
//                 Category:
//                 {" "}
//                 {listing.category?.name}
//             </p>

//             <div className="my-6 flex gap-3 flex-wrap">

//                 {listing.isApproved ? (
//                     <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full">
//                         ✅ Approved
//                     </span>
//                 ) : (
//                     <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full">
//                         ⏳ Pending Approval
//                     </span>
//                 )}

//                 {listing.isSold && (
//                     <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full">
//                         🔴 SOLD
//                     </span>
//                 )}
//                 {listing.isAuction && (
//                     <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full">
//                         🔨 AUCTION LISTING
//                     </span>
//                 )}

//             </div>

//             <div className="border rounded-xl p-6 my-8">

//                 <h2 className="text-2xl font-bold mb-5">
//                     Seller Actions
//                 </h2>

//                 <div className="flex flex-wrap gap-4">

//                     <button
//                         onClick={() =>
//                             router.push(
//                                 `/dashboard/my-listings/${listing.id}/edit`
//                             )
//                         }
//                         className="bg-blue-600 text-white px-6 py-3 rounded-xl"
//                     >
//                         ✏️ Edit Listing
//                     </button>

//                     {!listing.isSold && (

//                         <button
//                             onClick={markAsSold}
//                             className="bg-green-600 text-white px-6 py-3 rounded-xl"
//                         >
//                             ✔️ Mark as Sold
//                         </button>

//                     )}

//                     <button
//                         onClick={deleteListing}
//                         className="bg-red-600 text-white px-6 py-3 rounded-xl"
//                     >
//                         🗑 Delete Listing
//                     </button>

//                 </div>

//             </div>

//             <div className="mt-6">
//                 <h2 className="text-2xl font-bold mb-4">
//                     Images
//                 </h2>

//                 {listing.images?.length > 0 && (
//                     <div>
//                         <img
//                             src={
//                                 listing.images[
//                                     currentImage
//                                 ].imageUrl
//                             }
//                             alt={listing.title}
//                             className="w-full max-h-[500px] object-cover rounded-lg border"
//                         />

//                         <div className="flex gap-2 mt-4 flex-wrap">
//                             {listing.images.map(
//                                 (
//                                     image: any,
//                                     index: number
//                                 ) => (
//                                     <img
//                                         key={image.id}
//                                         src={
//                                             image.imageUrl
//                                         }
//                                         alt=""
//                                         onClick={() =>
//                                             setCurrentImage(
//                                                 index
//                                             )
//                                         }
//                                         className={`w-24 h-24 object-cover rounded cursor-pointer border ${currentImage ===
//                                             index
//                                             ? "border-black border-4"
//                                             : ""
//                                             }`}
//                                     />
//                                 )
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import API_BASE_URL from "@/lib/api-config";

export default function ListingDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const [listing, setListing] = useState<any>(null);
    const [currentImage, setCurrentImage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchListing = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");
                const res = await fetch(
                    `${API_BASE_URL}/api/sellers/my-listings/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to load listing");
                }

                setListing(data);
                setCurrentImage(0);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to load listing");
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [id]);

    const images = useMemo(() => {
        if (!listing) return [];
        return listing.images || listing.listingimage || [];
    }, [listing]);

    const statusLabel = useMemo(() => {
        if (!listing) return "Pending";
        if (listing.isSold) return "Sold";
        if (listing.status === "REJECTED") return "Rejected";
        if (listing.status === "APPROVED" || listing.isApproved) return "Approved";
        return "Pending";
    }, [listing]);

    const statusBadgeClass = (status: string) => {
        if (status === "Approved") return "bg-green-50 text-green-700 border-green-200";
        if (status === "Rejected") return "bg-red-50 text-red-700 border-red-200";
        if (status === "Sold") return "bg-slate-100 text-slate-700 border-slate-200";
        return "bg-orange-50 text-orange-700 border-orange-200";
    };

    const deleteListing = async () => {
        if (!listing) return;
        if (!confirm("Delete this listing permanently?")) return;

        try {
            setActionLoading(true);
            setError("");
            setSuccess("");

            const token = localStorage.getItem("token");
            const res = await fetch(
                `${API_BASE_URL}/api/listings/${listing.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Failed to delete listing");
            }

            router.push("/dashboard/my-listings");
        } catch (err: any) {
            setError(err.message || "Failed to delete listing");
        } finally {
            setActionLoading(false);
        }
    };

    const markAsSold = async () => {
        if (!listing) return;
        if (!confirm("Mark this listing as sold?")) return;

        try {
            setActionLoading(true);
            setError("");
            setSuccess("");

            const token = localStorage.getItem("token");
            const res = await fetch(
                `${API_BASE_URL}/api/listings/${listing.id}/sold`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to mark as sold");
            }

            setListing(data);
            setSuccess("Listing marked as sold.");
        } catch (err: any) {
            setError(err.message || "Failed to mark as sold");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[50vh] bg-[#f7f7f5] p-6 sm:p-8">
                <div className="mx-auto max-w-5xl">
                    <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
                    <div className="mt-6 h-72 animate-pulse rounded-2xl border border-gray-200 bg-white" />
                </div>
            </div>
        );
    }

    if (error && !listing) {
        return (
            <div className="min-h-[50vh] bg-[#f7f7f5] p-6 sm:p-8">
                <div className="mx-auto max-w-5xl">
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                    <Link
                        href="/dashboard/my-listings"
                        className="mt-4 inline-flex text-sm font-semibold text-[#d97706] hover:underline"
                    >
                        ← Back to My Listings
                    </Link>
                </div>
            </div>
        );
    }

    if (!listing) return null;

    return (
        <div className="min-h-screen bg-[#f7f7f5]">
            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <Link href="/dashboard" className="hover:text-[#d97706]">
                        Dashboard
                    </Link>
                    <span>/</span>
                    <Link
                        href="/dashboard/my-listings"
                        className="hover:text-[#d97706]"
                    >
                        My Listings
                    </Link>
                    <span>/</span>
                    <span className="font-semibold text-gray-700">#{listing.id}</span>
                </div>

                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d97706]">
                            Seller listing
                        </p>
                        <h1 className="mt-1 text-2xl font-extrabold text-[#24272b] sm:text-3xl">
                            {listing.title}
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            {listing.category?.name || "Uncategorized"}
                            {listing.isAuction ? " · Auction" : " · Fixed price"}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusBadgeClass(
                                statusLabel
                            )}`}
                        >
                            {statusLabel}
                        </span>
                        {listing.isAuction && (
                            <span className="inline-flex rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
                                Auction
                            </span>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {success}
                    </div>
                )}

                {listing.status === "REJECTED" && listing.rejectReason && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                        <p className="font-bold">Rejection reason</p>
                        <p className="mt-1">{listing.rejectReason}</p>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
                    {/* Images */}
                    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="aspect-[16/10] bg-gray-100">
                            {images.length > 0 ? (
                                <img
                                    src={images[currentImage]?.imageUrl}
                                    alt={listing.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                                    No image
                                </div>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto p-3">
                                {images.map((image: any, index: number) => (
                                    <button
                                        key={image.id || index}
                                        type="button"
                                        onClick={() => setCurrentImage(index)}
                                        className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${currentImage === index
                                                ? "border-[#ff9900]"
                                                : "border-transparent"
                                            }`}
                                    >
                                        <img
                                            src={image.imageUrl}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Side panel */}
                    <div className="space-y-5">
                        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                            <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                                Price
                            </p>
                            <p className="mt-1 text-3xl font-extrabold text-[#24272b]">
                                ₦{Number(listing.price || 0).toLocaleString()}
                            </p>

                            <div className="mt-5 space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between gap-3">
                                    <span>Category</span>
                                    <span className="font-semibold text-[#24272b]">
                                        {listing.category?.name || "—"}
                                    </span>
                                </div>
                                <div className="flex justify-between gap-3">
                                    <span>Listed</span>
                                    <span className="font-semibold text-[#24272b]">
                                        {listing.createdAt
                                            ? new Date(listing.createdAt).toLocaleDateString(
                                                "en-NG",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )
                                            : "—"}
                                    </span>
                                </div>
                                <div className="flex justify-between gap-3">
                                    <span>Type</span>
                                    <span className="font-semibold text-[#24272b]">
                                        {listing.isAuction ? "Auction" : "Fixed price"}
                                    </span>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                            <h2 className="text-sm font-bold text-[#24272b]">
                                Seller actions
                            </h2>
                            <p className="mt-1 text-xs text-gray-500">
                                Edit details, mark sold, or remove this listing.
                            </p>

                            <div className="mt-4 flex flex-col gap-2">
                                <Link
                                    href={`/dashboard/my-listings/${listing.id}/edit`}
                                    className="inline-flex items-center justify-center rounded-xl bg-[#ff9900] px-4 py-3 text-sm font-extrabold text-[#24272b] transition hover:bg-[#ffad28]"
                                >
                                    Edit listing
                                </Link>

                                {!listing.isSold && (
                                    <button
                                        type="button"
                                        disabled={actionLoading}
                                        onClick={markAsSold}
                                        className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-[#24272b] transition hover:bg-gray-50 disabled:opacity-60"
                                    >
                                        Mark as sold
                                    </button>
                                )}

                                <button
                                    type="button"
                                    disabled={actionLoading}
                                    onClick={deleteListing}
                                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                                >
                                    Delete listing
                                </button>

                                <Link
                                    href={`/listings/${listing.id}`}
                                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                >
                                    View public page
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Description */}
                <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                    <h2 className="text-sm font-bold text-[#24272b]">Description</h2>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                        {listing.description || "No description provided."}
                    </p>
                </section>
            </div>
        </div>
    );
}