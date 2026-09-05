"use client";

import { useEffect, useState } from "react";
import {
    useParams,
    useRouter,
} from "next/navigation";
import API_BASE_URL from "@/lib/api-config";

export default function ListingDetailsPage() {

    const params = useParams();
    const router = useRouter();
    const id = Array.isArray(params.id)
        ? params.id[0]
        : params.id;

    const [listing, setListing] =
        useState<any>(null);
    const [currentImage, setCurrentImage] =
        useState(0);

    // const [isEditing, setIsEditing] =
    //     useState(false);

    // const [formData, setFormData] =
    //     useState({
    //         title: "",
    //         description: "",
    //         price: "",
    //         categoryId: "",
    //     });

    useEffect(() => {
        if (!id) return;
        const fetchListing = async () => {
            try {
                const token =
                    localStorage.getItem(
                        "token"
                    );
                console.log("ID:", id);
                const res = await fetch(
                    `${API_BASE_URL}/api/sellers/my-listings/${id}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                const data =
                    await res.json();

                console.log(data);
                setListing(data);

                // setFormData({
                //     title: data.title,
                //     description: data.description,
                //     price: data.price,
                //     categoryId: data.categoryId,
                // });
            } catch (error) {
                console.error(error);
            }
        };

        fetchListing();
    }, [id]);

    const deleteListing = async () => {

        if (
            !confirm(
                "Delete this listing permanently?"
            )
        ) {
            return;
        }

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
            alert("Failed to delete.");
            return;
        }

        alert("Listing deleted.");

        window.location.href =
            "/dashboard/my-listings";
    };

    // const saveChanges = async () => {
    //     try {
    //         const token =
    //             localStorage.getItem("token");

    //         const res = await fetch(
    //             `${API_BASE_URL}/api/sellers/my-listings/${id}`,
    //             {
    //                 method: "PUT",
    //                 headers: {
    //                     "Content-Type":
    //                         "application/json",
    //                     Authorization:
    //                         `Bearer ${token}`,
    //                 },
    //                 body: JSON.stringify(formData),
    //             }
    //         );

    //         const data =
    //             await res.json();

    //         if (res.ok) {
    //             setListing(data);
    //             setIsEditing(false);

    //             alert(
    //                 "Listing updated successfully"
    //             );
    //         } else {
    //             alert(data.message);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    const markAsSold = async () => {

        if (!confirm("Mark this listing as sold?")) {
            return;
        }

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
            alert(data.message);
            return;
        }

        alert("Listing marked as sold.");

        setListing(data);
    };

    if (!listing) {
        return (
            <div className="p-10">
                Loading...
            </div>
        );
    }

    return (
        <div className="p-10">
            <h1 className="text-4xl font-bold mb-4">
                {listing.title}
            </h1>

            <p className="mb-4 text-gray-700">
                {listing.description}
            </p>

            <p>
                Price: ${listing.price}
            </p>

            <p>
                Category:
                {" "}
                {listing.category?.name}
            </p>

            <div className="my-6 flex gap-3 flex-wrap">

                {listing.isApproved ? (
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full">
                        ✅ Approved
                    </span>
                ) : (
                    <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full">
                        ⏳ Pending Approval
                    </span>
                )}

                {listing.isSold && (
                    <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full">
                        🔴 SOLD
                    </span>
                )}
                {listing.isAuction && (
                    <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full">
                        🔨 AUCTION LISTING
                    </span>
                )}

            </div>

            <div className="border rounded-xl p-6 my-8">

                <h2 className="text-2xl font-bold mb-5">
                    Seller Actions
                </h2>

                <div className="flex flex-wrap gap-4">

                    <button
                        onClick={() =>
                            router.push(
                                `/dashboard/my-listings/${listing.id}/edit`
                            )
                        }
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl"
                    >
                        ✏️ Edit Listing
                    </button>

                    {!listing.isSold && (

                        <button
                            onClick={markAsSold}
                            className="bg-green-600 text-white px-6 py-3 rounded-xl"
                        >
                            ✔️ Mark as Sold
                        </button>

                    )}

                    <button
                        onClick={deleteListing}
                        className="bg-red-600 text-white px-6 py-3 rounded-xl"
                    >
                        🗑 Delete Listing
                    </button>

                </div>

            </div>

            <div className="mt-6">
                <h2 className="text-2xl font-bold mb-4">
                    Images
                </h2>

                {listing.images?.length > 0 && (
                    <div>
                        <img
                            src={
                                listing.images[
                                    currentImage
                                ].imageUrl
                            }
                            alt={listing.title}
                            className="w-full max-h-[500px] object-cover rounded-lg border"
                        />

                        <div className="flex gap-2 mt-4 flex-wrap">
                            {listing.images.map(
                                (
                                    image: any,
                                    index: number
                                ) => (
                                    <img
                                        key={image.id}
                                        src={
                                            image.imageUrl
                                        }
                                        alt=""
                                        onClick={() =>
                                            setCurrentImage(
                                                index
                                            )
                                        }
                                        className={`w-24 h-24 object-cover rounded cursor-pointer border ${currentImage ===
                                            index
                                            ? "border-black border-4"
                                            : ""
                                            }`}
                                    />
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
