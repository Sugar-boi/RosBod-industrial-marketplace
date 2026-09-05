"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import API_BASE_URL from "@/lib/api-config";
import ImageGallery from "./components/ImageGallery";
import FavoriteButton from "./FavoriteButton";
import AuctionSection from "./AuctionSection";
import { getCurrentUser } from "@/lib/auth";
import RejectListingModal from "@/components/RejectListingModal";
// import ReviewForm from "@/components/ReviewForm";
import ReviewSection from "@/components/ReviewSection";
import RelatedListings from "@/components/RelatedListings";


export default function ListingClient({
    id,
}: {
    id: string;
}) {
    const [selectedListing, setSelectedListing] =
        useState<number | null>(null);
    const [listing, setListing] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const [user, setUser] = useState<any>(null);
    const [showRejectModal, setShowRejectModal] =
        useState(false);

    useEffect(() => {
        if (!id) return;
        fetch(`${API_BASE_URL}/api/listings/${id}/view`, {
            method: "POST",
        }).catch(() => { });
    }, [id]);

    useEffect(() => {

        setUser(getCurrentUser());

        const fetchListing = async () => {
            try {
                const token =
                    localStorage.getItem("token");
                console.log("TOKEN:", token);

                const res = await fetch(
                    `${API_BASE_URL}/api/listings/${id}`,
                    {
                        headers: token
                            ? {
                                Authorization: `Bearer ${token}`,
                            }
                            : {},
                    }
                );


                const data = await res.json();

                if (!res.ok) {
                    setError(data.message);
                    return;
                }

                setListing(data);
            } catch (err) {
                setError("Failed to load listing");
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [id]);

    if (loading) {
        return (
            <div className="p-10 text-center">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center text-red-500">
                {error}
            </div>
        );
    }

    if (!listing) {
        return null;
    }
    const auctionEnded =
        listing.auction &&
        new Date(listing.auction.endDate) < new Date();

    const approveListing = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch(
            `${API_BASE_URL}/api/listings/${listing.id}/approve`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!res.ok) {
            alert("Failed to approve listing");
            return;
        }

        alert("Listing approved!");

        setListing({
            ...listing,
            isApproved: true,
        });
    };

    const markSold = async () => {
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

        if (!res.ok) {
            alert("Failed to mark listing as sold.");
            return;
        }

        alert("Listing marked as sold.");

        setListing({
            ...listing,
            isSold: true,
        });
    };

    const rejectListing = async (reason: string) => {


        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `${API_BASE_URL}/api/listings/${listing.id}/reject`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        rejectReason: reason,
                    }),
                }
            );

            if (!res.ok) {
                alert("Failed to reject listing");
                return;
            }
            setShowRejectModal(false);
            setSelectedListing(null);

        } catch (err) {
            console.error(err);
        }

        alert("Listing rejected");

        window.location.href = "/admin";
    };

    const formatPrice = (amount: number | null | undefined) => {
        return `₦${Number(amount ?? 0).toLocaleString()}`;
    };

    const detailRows = listing.equipmentDetails
        ? [
            ["Brand", listing.equipmentDetails.manufacturer],
            ["Model", listing.equipmentDetails.model],
            ["Year", listing.equipmentDetails.year],
            ["Operating Hours", listing.equipmentDetails.hoursWorked],
            ["Bucket Capacity", listing.equipmentDetails.bucketCapacity],
            ["Serial Number", listing.equipmentDetails.serialNumber],
            ["Overall Condition", listing.equipmentDetails.overallCondition],
            ["Mechanical Condition", listing.equipmentDetails.mechanicalCondition],
            ["Hydraulic Condition", listing.equipmentDetails.hydraulicCondition],
            ["State", listing.equipmentDetails.state],
            ["City", listing.equipmentDetails.city],
            ["Listing ID", listing.id],
        ].filter(([, value]) => value !== null && value !== undefined && value !== "")
        : [];

    const propertyRows = listing.propertyDetails
        ? [
            [
                "Property Type",
                listing.propertyDetails.propertyType,
            ],
            [
                "Bedrooms",
                listing.propertyDetails.bedrooms,
            ],
            [
                "Bathrooms",
                listing.propertyDetails.bathrooms,
            ],
            [
                "Plot Size",
                listing.propertyDetails.plotSize,
            ],
            [
                "Land Size",
                listing.propertyDetails.landSize,
            ],
            [
                "Building Size",
                listing.propertyDetails.buildingSize,
            ],
            [
                "Title Document",
                listing.propertyDetails.titleDocument,
            ],
            [
                "Land Title",
                listing.propertyDetails.landTitle,
            ],
            [
                "Zoning",
                listing.propertyDetails.zoning,
            ],
            [
                "Property Condition",
                listing.propertyDetails.condition,
            ],
            [
                "State",
                listing.propertyDetails.state,
            ],
            [
                "City",
                listing.propertyDetails.city,
            ],
            [
                "Address",
                listing.propertyDetails.address,
            ],
        ].filter(
            ([, value]) =>
                value !== null &&
                value !== undefined &&
                value !== ""
        )
        : [];

    const locationText = [
        listing.location,
        listing.address,
        listing.city,
        listing.state,
        listing.propertyDetails?.location,
        listing.propertyDetails?.address,
        listing.propertyDetails?.city,
        listing.propertyDetails?.state,
        listing.equipmentDetails?.location,
        listing.equipmentDetails?.city,
        listing.equipmentDetails?.state,
    ]
        .filter(Boolean)
        .filter(
            (value, index, array) =>
                array.indexOf(value) === index
        )
        .join(", ");

    return (
        <div className="min-h-screen bg-[#f7f8fa]">

            <div className="mx-auto max-w-[1440px] px-3 py-4 sm:px-5 lg:px-8 lg:py-6">

                {/* BREADCRUMB */}

                <div className="mb-4 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500">

                    <Link
                        href="/"
                        className="transition hover:text-orange-600"
                    >
                        Home
                    </Link>

                    <span>/</span>

                    <Link
                        href="/listings"
                        className="transition hover:text-orange-600"
                    >
                        {listing.category?.name || "Listings"}
                    </Link>

                    <span>/</span>

                    <span className="max-w-[220px] truncate text-gray-700 sm:max-w-[420px]">
                        {listing.title}
                    </span>

                </div>

                {/* PAGE TITLE */}

                <div className="mb-5">

                    <div className="flex flex-wrap items-center gap-2">

                        <h1 className="text-xl font-extrabold tracking-tight text-[#24272b] sm:text-2xl lg:text-3xl">

                            {listing.title}

                        </h1>

                        {listing.isAuction && !auctionEnded && (

                            <span className="rounded-md bg-red-50 px-2 py-1 text-[10px] font-bold text-red-600">

                                LIVE AUCTION

                            </span>

                        )}

                        {listing.isSold && (

                            <span className="rounded-md bg-[#24272b] px-2 py-1 text-[10px] font-bold text-white">

                                SOLD

                            </span>

                        )}



                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">

                        {listing.category?.name && (

                            <span className="rounded-md bg-orange-50 px-2 py-1 text-[10px] font-semibold text-orange-700">

                                {listing.category.name}

                            </span>

                        )}

                        <span className="text-[11px] text-gray-400">

                            Listed{" "}

                            {new Date(
                                listing.createdAt
                            ).toLocaleDateString()}

                        </span>

                    </div>

                </div>

                {/* DESKTOP TOP LAYOUT */}

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">

                    {/* LEFT SIDE */}

                    <div className="min-w-0">

                        {/* IMAGE GALLERY */}

                        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-sm sm:p-3">

                            <ImageGallery
                                images={listing.images || []}
                            />

                        </section>

                        {/* DETAILS CONTENT */}

                        <section className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                            {/* TABS */}

                            <div className="flex overflow-x-auto border-b border-gray-200 px-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        document
                                            .getElementById("details")
                                            ?.scrollIntoView({
                                                behavior: "smooth",
                                                block: "start",
                                            })
                                    }
                                    className="shrink-0 border-b-2 border-orange-500 px-4 py-3 text-xs font-bold text-[#24272b]"
                                >
                                    Details
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        document
                                            .getElementById("description")
                                            ?.scrollIntoView({
                                                behavior: "smooth",
                                                block: "start",
                                            })
                                    }
                                    className="shrink-0 px-4 py-3 text-xs font-medium text-gray-500"
                                >
                                    Description
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        document
                                            .getElementById("location")
                                            ?.scrollIntoView({
                                                behavior: "smooth",
                                                block: "start",
                                            })
                                    }
                                    className="shrink-0 px-4 py-3 text-xs font-medium text-gray-500"
                                >
                                    Location
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        document
                                            .getElementById("seller")
                                            ?.scrollIntoView({
                                                behavior: "smooth",
                                                block: "start",
                                            })
                                    }
                                    className="shrink-0 px-4 py-3 text-xs font-medium text-gray-500"
                                >
                                    Seller
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        document
                                            .getElementById("reviews")
                                            ?.scrollIntoView({
                                                behavior: "smooth",
                                                block: "start",
                                            })
                                    }
                                    className="shrink-0 px-4 py-3 text-xs font-medium text-gray-500"
                                >
                                    Reviews
                                </button>
                            </div>

                            <div
                                id="details"
                                className="scroll-mt-28 p-4 sm:p-6"
                            >

                                {/* EQUIPMENT DETAILS */}

                                {detailRows.length > 0 && (

                                    <div>

                                        <h2 className="text-sm font-extrabold text-[#24272b]">

                                            Equipment Details

                                        </h2>

                                        <div className="mt-4 grid gap-x-8 gap-y-0 md:grid-cols-2">

                                            {detailRows.map(
                                                ([label, value]) => (

                                                    <div
                                                        key={String(label)}
                                                        className="grid grid-cols-[minmax(110px,0.9fr)_minmax(0,1.1fr)] gap-4 border-b border-gray-100 py-2.5 text-[11px]"
                                                    >

                                                        <span className="font-medium text-gray-400">

                                                            {label}

                                                        </span>

                                                        <span className="break-words text-right font-semibold text-[#3b3f45]">

                                                            {String(value)}

                                                        </span>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </div>

                                )}

                                {/* PROPERTY DETAILS */}

                                {propertyRows.length > 0 && (

                                    <div
                                        className={
                                            detailRows.length > 0
                                                ? "mt-8"
                                                : ""
                                        }
                                    >

                                        <h2 className="text-sm font-extrabold text-[#24272b]">

                                            Property Details

                                        </h2>

                                        <div className="mt-4 grid gap-x-8 md:grid-cols-2">

                                            {propertyRows.map(
                                                ([label, value]) => (

                                                    <div
                                                        key={String(label)}
                                                        className="
                        grid
                        grid-cols-[minmax(110px,0.9fr)_minmax(0,1.1fr)]
                        gap-4
                        border-b
                        border-gray-100
                        py-2.5
                        text-[11px]
                    "
                                                    >

                                                        <span className="font-medium text-gray-400">

                                                            {label}

                                                        </span>

                                                        <span className="break-words text-right font-semibold text-[#3b3f45]">

                                                            {String(value)}

                                                        </span>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </div>

                                )}

                                {/* QUARRY DETAILS */}

                                {listing.quarryDetails && (

                                    <section className="mt-8">

                                        <h2 className="text-sm font-extrabold text-[#24272b]">

                                            Quarry Details

                                        </h2>

                                        <div className="mt-4 grid gap-x-8 md:grid-cols-2">

                                            {[
                                                ["Quarry Type", listing.quarryDetails.quarryType],
                                                ["Reserve Estimate", listing.quarryDetails.reserveEstimate],
                                                ["Production Capacity", listing.quarryDetails.productionCapacity],
                                                ["Mining License", listing.quarryDetails.miningLicense],
                                            ]
                                                .filter(([, value]) => value)
                                                .map(([label, value]) => (

                                                    <div
                                                        key={String(label)}
                                                        className="grid grid-cols-[1fr_1fr] gap-4 border-b border-gray-100 py-2.5 text-[11px]"
                                                    >

                                                        <span className="text-gray-400">

                                                            {label}

                                                        </span>

                                                        <span className="text-right font-semibold text-[#3b3f45]">

                                                            {String(value)}

                                                        </span>

                                                    </div>

                                                ))}

                                        </div>

                                    </section>

                                )}

                                {/* DESCRIPTION */}

                                <section
                                    id="description"
                                    className="mt-8 scroll-mt-28"
                                >

                                    <h2 className="text-sm font-extrabold text-[#24272b]">

                                        Description

                                    </h2>

                                    <p className="mt-4 whitespace-pre-line text-xs leading-6 text-gray-600">

                                        {listing.description}

                                    </p>

                                </section>

                                {/* LOCATION */}

                                <section
                                    id="location"
                                    className="mt-8 scroll-mt-28 border-t border-gray-100 pt-7"
                                >

                                    <h2 className="text-sm font-extrabold text-[#24272b]">

                                        Location

                                    </h2>

                                    <p className="mt-3 text-xs font-medium text-[#3b3f45]">

                                        📍{" "}

                                        {locationText || "Location not provided"}

                                    </p>

                                    {/* <div className="mt-4 flex h-44 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-400">

                                        Map — location preview

                                    </div> */}

                                </section>

                            </div>

                        </section>

                        {/* REVIEWS */}

                        <section
                            id="reviews"
                            className="mt-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">

                            <ReviewSection
                                listingId={listing.id}
                            />

                        </section>

                        {/* RELATED LISTINGS */}

                        <section className="mt-5">

                            <RelatedListings
                                listingId={listing.id}
                            />

                        </section>

                    </div>

                    {/* RIGHT SIDEBAR */}

                    <aside className="min-w-0">

                        <div className="xl:sticky xl:top-24">

                            {/* PRICE CARD */}

                            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                                <div className="p-4 sm:p-5">

                                    <div className="flex items-start justify-between gap-4">

                                        <div>

                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">

                                                {listing.isAuction
                                                    ? "Current Bid"
                                                    : "Asking Price"}

                                            </p>

                                            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#24272b] sm:text-3xl">

                                                {listing.isAuction
                                                    ? formatPrice(
                                                        listing.auction?.currentBid
                                                    )
                                                    : formatPrice(
                                                        listing.price
                                                    )}

                                            </h2>

                                        </div>

                                        <div className="flex items-center gap-2">

                                            {listing.isSold ? (

                                                <span className="rounded-md bg-gray-900 px-2 py-1 text-[10px] font-bold text-white">

                                                    SOLD

                                                </span>

                                            ) : (

                                                <span className="rounded-md bg-green-50 px-2 py-1 text-[10px] font-bold text-green-600">

                                                    ACTIVE

                                                </span>

                                            )}

                                            <FavoriteButton
                                                listingId={listing.id}
                                            />

                                        </div>

                                    </div>

                                    {listing.isAuction &&
                                        listing.auction && (

                                            <div className="mt-4 rounded-lg bg-red-50 px-3 py-2.5">

                                                <p className="text-[10px] font-semibold text-red-500">

                                                    {auctionEnded
                                                        ? "Auction ended"
                                                        : "Auction ends"}

                                                </p>

                                                <p className="mt-1 text-xs font-bold text-red-700">

                                                    {new Date(
                                                        listing.auction.endDate
                                                    ).toLocaleString()}

                                                </p>

                                            </div>

                                        )}

                                    {!listing.isSold && (

                                        <div className="mt-5 space-y-2.5">

                                            {listing.seller?.whatsapp && (

                                                <a
                                                    href={`https://wa.me/${listing.seller.whatsapp}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex w-full items-center justify-center rounded-lg bg-[#22c55e] px-4 py-3 text-xs font-bold text-white transition hover:bg-green-600"
                                                >

                                                    WhatsApp Seller

                                                </a>

                                            )}

                                            {listing.seller?.email && (

                                                <a
                                                    href={`mailto:${listing.seller.email}`}
                                                    className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-3 text-xs font-bold text-[#24272b] transition hover:bg-gray-50"
                                                >

                                                    Email Seller

                                                </a>

                                            )}

                                            <button
                                                type="button"
                                                className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-3 text-xs font-bold text-[#24272b] transition hover:bg-gray-50"
                                            >

                                                ♡ Save Listing

                                            </button>

                                        </div>

                                    )}

                                </div>

                            </section>

                            {/* SELLER CARD */}

                            <section
                                id="seller"
                                className="mt-4 scroll-mt-28 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                            >

                                <div className="border-b border-gray-100 px-4 py-3">

                                    <h2 className="text-xs font-extrabold text-[#24272b]">

                                        About the Seller

                                    </h2>

                                </div>

                                <div className="p-4">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-orange-600">

                                            {listing.seller?.name
                                                ?.charAt(0)
                                                ?.toUpperCase() || "S"}

                                        </div>

                                        <div className="min-w-0">

                                            <Link
                                                href={`/sellers/${listing.seller.id}`}
                                                className="block truncate text-xs font-bold text-[#24272b] transition hover:text-orange-600"
                                            >

                                                {listing.seller?.name}

                                            </Link>

                                            <p className="mt-1 truncate text-[10px] text-gray-500">

                                                {listing.seller?.companyName ||
                                                    "Independent Seller"}

                                            </p>

                                        </div>

                                    </div>

                                    <div className="mt-4 grid grid-cols-2 divide-x divide-gray-100 rounded-lg border border-gray-100">

                                        <div className="p-3 text-center">

                                            <p className="text-sm font-extrabold text-[#24272b]">

                                                {listing.seller?.activeListings ??
                                                    0}

                                            </p>

                                            <p className="mt-1 text-[9px] text-gray-400">

                                                Active Listings

                                            </p>

                                        </div>

                                        <div className="p-3 text-center">

                                            <p className="text-sm font-extrabold text-[#24272b]">

                                                {listing.seller?.memberSince
                                                    ? new Date(
                                                        listing.seller.memberSince
                                                    ).getFullYear()
                                                    : "—"}

                                            </p>

                                            <p className="mt-1 text-[9px] text-gray-400">

                                                Member Since

                                            </p>

                                        </div>

                                    </div>

                                    <Link
                                        href={`/sellers/${listing.seller.id}`}
                                        className="mt-4 flex w-full items-center justify-center rounded-lg border border-gray-200 px-4 py-2.5 text-[10px] font-bold text-[#24272b] transition hover:bg-gray-50"
                                    >

                                        View Seller Profile →

                                    </Link>

                                </div>

                            </section>

                            {/* LISTING INFORMATION */}

                            <section className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

                                <p className="text-[10px] text-gray-400">

                                    Listed{" "}

                                    {new Date(
                                        listing.createdAt
                                    ).toLocaleDateString()}

                                </p>

                                <p className="mt-2 text-[10px] text-gray-400">

                                    Listing ID:{" "}

                                    {listing.id}

                                </p>

                            </section>

                            {/* ADMIN ACTIONS */}

                            {user?.role === "ADMIN" &&
                                !listing.isApproved && (

                                    <section className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">

                                        <p className="text-xs font-bold text-red-700">

                                            Admin Review

                                        </p>

                                        <div className="mt-3 grid grid-cols-2 gap-2">

                                            <button
                                                onClick={approveListing}
                                                className="rounded-lg bg-green-600 px-3 py-2.5 text-xs font-bold text-white"
                                            >

                                                Approve

                                            </button>

                                            <button
                                                onClick={() => {

                                                    setSelectedListing(
                                                        listing.id
                                                    );

                                                    setShowRejectModal(
                                                        true
                                                    );

                                                }}
                                                className="rounded-lg bg-red-600 px-3 py-2.5 text-xs font-bold text-white"
                                            >

                                                Reject

                                            </button>

                                        </div>

                                    </section>

                                )}

                            {/* SELLER ACTION */}

                            {user?.id === listing.seller?.id &&
                                !listing.isSold && (

                                    <button
                                        onClick={markSold}
                                        className="mt-4 w-full rounded-xl bg-[#24272b] px-4 py-3 text-xs font-bold text-white"
                                    >

                                        Mark as Sold

                                    </button>

                                )}

                        </div>

                    </aside>

                </div>

                {/* AUCTION CONTENT */}

                {auctionEnded &&
                    listing.auction && (

                        <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600">

                            Auction Ended

                        </div>

                    )}

                {listing.auction &&
                    !auctionEnded && (

                        <AuctionSection
                            auction={listing.auction}
                        />

                    )}

                {listing.auction?.bids?.length > 0 && (

                    <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                        <h3 className="text-sm font-extrabold text-[#24272b]">

                            Bid History

                        </h3>

                        <div className="mt-4 space-y-2">

                            {listing.auction.bids.map(
                                (bid: any) => (

                                    <div
                                        key={bid.id}
                                        className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
                                    >

                                        <span className="text-xs text-gray-500">

                                            Bid

                                        </span>

                                        <span className="text-xs font-bold text-[#24272b]">

                                            {formatPrice(
                                                bid.amount
                                            )}

                                        </span>

                                    </div>

                                )
                            )}

                        </div>

                    </section>

                )}

                {showRejectModal && (

                    <RejectListingModal
                        open={showRejectModal}
                        onClose={() => {

                            setShowRejectModal(
                                false
                            );

                            setSelectedListing(
                                null
                            );

                        }}
                        onSubmit={
                            rejectListing
                        }
                    />

                )}

            </div>

        </div>
    );
}
