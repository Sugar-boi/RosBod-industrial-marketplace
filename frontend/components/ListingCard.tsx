"use client";

import FavoriteButton from "@/app/listings/[id]/FavoriteButton";
import Link from "next/link";
// import FavoriteButton from "@/components/FavoriteButton";

export default function ListingCard({
    listing,
}: {
    listing: any;
}) {

    const state =
        listing.equipmentDetails?.state ||
        listing.propertyDetails?.state ||
        listing.quarryDetails?.state ||
        listing.sparePartDetails?.state ||
        "";

    const city =
        listing.equipmentDetails?.city ||
        listing.propertyDetails?.city ||
        listing.quarryDetails?.city ||
        listing.sparePartDetails?.city ||
        "";

    const address =
        listing.propertyDetails?.address ||
        "";

    const location = [city, state]
        .filter(Boolean)
        .join(", ");
    const isAuction =
        listing.isAuction &&
        listing.auction;

    const imageUrl =
        listing.images?.[0]?.imageUrl;

    const categoryName =
        listing.category?.name ||
        "Industrial Asset";

    const parentCategory =
        listing.category?.parent?.name;

    const sellerName =
        listing.seller?.name ||
        "Rosebod Seller";

    const formattedPrice =
        Number(
            isAuction
                ? listing.auction?.currentBid
                : listing.price
        ).toLocaleString();



    return (
        <Link
            href={
                isAuction
                    ? `/auctions/${listing.auction.id}`
                    : `/listings/${listing.id}`
            }
            className="block h-full"
        >
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl">

                {/* IMAGE */}

                <div className="relative h-52 overflow-hidden bg-gray-100 sm:h-56 lg:h-60">

                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={listing.title}
                            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${listing.isSold
                                ? "grayscale opacity-70"
                                : ""
                                }`}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-5xl">
                            🏗️
                        </div>
                    )}

                    {/* CATEGORY */}

                    <div className="absolute left-4 top-4">

                        <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#24272b] shadow-sm backdrop-blur">

                            {parentCategory
                                ? `${parentCategory} · ${categoryName}`
                                : categoryName}

                        </span>

                    </div>
                    <div
                        className="
            absolute
            right-4
            top-4
            z-20
        "
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <FavoriteButton
                            listingId={listing.id}
                        />
                    </div>

                    {/* SOLD */}

                    {listing.isSold && (

                        <span className="absolute right-4 top-16 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow">

                            SOLD

                        </span>

                    )}

                    {/* AUCTION */}

                    {isAuction && (

                        <span
                            className={`absolute bottom-4 left-4 rounded-full bg-[#ff9900] px-3 py-1.5 text-xs font-bold text-[#24272b] shadow ${listing.isSold
                                ? ""
                                : ""
                                }`}
                        >

                            🔨 LIVE AUCTION

                        </span>

                    )}

                </div>

                {/* CONTENT */}

                <div className="flex flex-1 flex-col p-4 sm:p-5">

                    <h3 className="line-clamp-2 text-lg font-bold leading-6 text-[#24272b] transition-colors group-hover:text-[#d97706]">

                        {listing.title}

                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">

                        {listing.description}

                    </p>

                    {location && (
                        <p className="flex items-center gap-1 text-sm text-gray-500 mt-3">
                            📍 {location}
                        </p>
                    )}

                    {/* SELLER */}

                    <div className="mt-5 flex items-center justify-between gap-3">

                        <div className="flex min-w-0 items-center gap-2">

                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm">

                                👤

                            </div>

                            <span className="truncate text-sm font-medium text-gray-600">

                                {sellerName}

                            </span>

                        </div>

                        {listing.seller?.isApproved && (

                            <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700">

                                ✓ Verified

                            </span>

                        )}

                    </div>

                    {/* PRICE */}

                    <div className="mt-5 border-t border-gray-100 pt-4">

                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">

                            {isAuction
                                ? "Current Bid"
                                : "Price"}

                        </p>

                        <div className="mt-1 flex items-end justify-between gap-3">

                            <p className="text-2xl font-extrabold text-[#24272b]">

                                ₦{formattedPrice}

                            </p>

                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff4df] text-lg font-bold text-[#d97706] transition-transform duration-300 group-hover:translate-x-1">

                                →

                            </span>

                        </div>

                        {isAuction && (

                            <p className="mt-2 text-xs font-medium text-red-500">

                                Ends{" "}

                                {new Date(
                                    listing.auction.endDate
                                ).toLocaleDateString(
                                    "en-NG",
                                    {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    }
                                )}

                            </p>

                        )}

                    </div>

                </div>

            </article>
        </Link>
    );
}