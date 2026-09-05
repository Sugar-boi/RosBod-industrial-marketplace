import Link from "next/link";
import API_BASE_URL from "@/lib/api-config";
import ReviewSection from "@/components/ReviewSection";

async function getSeller(id: string) {
    const res = await fetch(
        `${API_BASE_URL}/api/sellers/profile/${id}`,
        {
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch seller");
    }

    return res.json();
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatMemberSince(date: string) {
    return new Date(date).toLocaleDateString("en-NG", {
        month: "long",
        year: "numeric",
    });
}

function formatPrice(value: number | string | undefined) {
    if (value === undefined || value === null) {
        return "Price on request";
    }

    return `₦${Number(value).toLocaleString("en-NG")}`;
}

function getInitials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .map((word: string) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function getListingImage(listing: any) {
    return (
        listing.listingimage?.[0]?.imageUrl ||
        listing.images?.[0]?.imageUrl ||
        null
    );
}

function getListingLocation(listing: any) {
    const details =
        listing.equipmentDetails ||
        listing.propertyDetails ||
        listing.quarryDetails ||
        listing.sparepartDetails;

    if (!details) return "";

    return [details.city, details.state]
        .filter(Boolean)
        .join(", ");
}

function getCategoryName(listing: any) {
    return (
        listing.category?.name ||
        "Industrial Asset"
    );
}

function getAuctionLabel(auction: any) {
    if (!auction) return null;

    if (auction.status === "LIVE") {
        return "LIVE AUCTION";
    }

    if (auction.status === "SCHEDULED") {
        return "UPCOMING AUCTION";
    }

    if (auction.status === "SOLD") {
        return "SOLD";
    }

    if (auction.status === "ENDED") {
        return "AUCTION ENDED";
    }

    return "AUCTION";
}

export default async function SellerPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const seller = await getSeller(id);

    /*
     * IMPORTANT:
     *
     * The backend currently returns:
     *
     * seller.listing
     *
     * NOT seller.listings.
     */
    const listings = Array.isArray(seller.listing)
        ? seller.listing
        : [];

    /*
     * Auctions already come attached to each listing:
     *
     * listing.auction
     *
     * We simply derive them on the frontend.
     */
    const auctions = listings.filter(
        (listing: any) => listing.auction
    );

    const sellerName =
        seller.companyName ||
        seller.name ||
        "Seller";

    return (
        <main className="min-h-screen bg-[#f7f7f5]">

            {/* =====================================================
                DESKTOP / TABLET HEADER
            ====================================================== */}

            <section className="hidden md:block bg-[#252525] text-white">

                <div className="mx-auto max-w-7xl px-8 py-8">

                    <div className="flex items-center justify-between gap-8">

                        <div className="flex items-center gap-5">

                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#3b3b3b] text-2xl font-bold text-white ring-2 ring-[#f28c28]">
                                {getInitials(sellerName)}
                            </div>

                            <div>

                                <div className="flex items-center gap-3">

                                    <h1 className="text-3xl font-bold">
                                        {sellerName}
                                    </h1>

                                    {seller.isApproved && (
                                        <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-400">
                                            ✓ Verified Seller
                                        </span>
                                    )}

                                </div>

                                {seller.location && (
                                    <p className="mt-2 text-sm text-gray-400">
                                        📍 {seller.location}
                                    </p>
                                )}

                                <div className="mt-2 flex gap-5 text-xs text-gray-400">

                                    <span>
                                        Member since{" "}
                                        {formatMemberSince(
                                            seller.createdAt
                                        )}
                                    </span>

                                    <span>
                                        {listings.length}{" "}
                                        {listings.length === 1
                                            ? "Listing"
                                            : "Listings"}
                                    </span>

                                    <span>
                                        {auctions.length}{" "}
                                        {auctions.length === 1
                                            ? "Auction"
                                            : "Auctions"}
                                    </span>

                                </div>

                            </div>

                        </div>


                        <div className="flex gap-3">

                            {seller.whatsapp && (
                                <a
                                    href={`https://wa.me/${seller.whatsapp.replace(/\D/g, "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-lg bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#20bd5a]"
                                >
                                    WhatsApp
                                </a>
                            )}

                            {seller.email && (
                                <a
                                    href={`mailto:${seller.email}`}
                                    className="rounded-lg border border-gray-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
                                >
                                    Email Seller
                                </a>
                            )}

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                MOBILE HEADER
            ====================================================== */}

            <section className="md:hidden bg-[#252525] px-5 py-6 text-white">

                <div className="flex items-start gap-4">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#3b3b3b] text-lg font-bold ring-2 ring-[#f28c28]">
                        {getInitials(sellerName)}
                    </div>

                    <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                            <h1 className="text-xl font-bold">
                                {sellerName}
                            </h1>

                            {seller.isApproved && (
                                <span className="rounded-full bg-green-500/15 px-2 py-1 text-[10px] font-semibold text-green-400">
                                    ✓ Verified
                                </span>
                            )}

                        </div>

                        {seller.location && (
                            <p className="mt-1 text-xs text-gray-400">
                                📍 {seller.location}
                            </p>
                        )}

                        <p className="mt-2 text-[11px] text-gray-400">
                            Member since{" "}
                            {formatMemberSince(
                                seller.createdAt
                            )}
                        </p>

                    </div>

                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">

                    {seller.whatsapp && (
                        <a
                            href={`https://wa.me/${seller.whatsapp.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-[#25D366] px-3 py-2.5 text-center text-xs font-semibold"
                        >
                            WhatsApp
                        </a>
                    )}

                    {seller.email && (
                        <a
                            href={`mailto:${seller.email}`}
                            className="rounded-lg border border-gray-600 px-3 py-2.5 text-center text-xs font-semibold"
                        >
                            Email
                        </a>
                    )}

                </div>

            </section>


            {/* =====================================================
                MAIN PAGE
            ====================================================== */}

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8 lg:py-8">


                {/* =================================================
                    DESKTOP / TABLET TABS
                ================================================== */}

                <div className="hidden md:flex items-center gap-8 border-b border-gray-200">

                    <a
                        href="#listings"
                        className="border-b-2 border-[#f28c28] pb-4 text-sm font-semibold text-[#252525]"
                    >
                        Listings{" "}
                        <span className="text-gray-400">
                            ({listings.length})
                        </span>
                    </a>

                    <a
                        href="#auctions"
                        className="pb-4 text-sm text-gray-500 hover:text-[#252525]"
                    >
                        Auctions{" "}
                        <span className="text-gray-400">
                            ({auctions.length})
                        </span>
                    </a>

                    <a
                        href="#about"
                        className="pb-4 text-sm text-gray-500 hover:text-[#252525]"
                    >
                        About
                    </a>

                    <a
                        href="#reviews"
                        className="pb-4 text-sm text-gray-500 hover:text-[#252525]"
                    >
                        Reviews
                    </a>

                </div>


                {/* =================================================
                    MOBILE TABS
                ================================================== */}

                <div className="md:hidden flex overflow-x-auto gap-6 border-b border-gray-200">

                    <a
                        href="#listings"
                        className="shrink-0 border-b-2 border-[#f28c28] pb-3 text-xs font-semibold text-[#252525]"
                    >
                        Listings ({listings.length})
                    </a>

                    <a
                        href="#auctions"
                        className="shrink-0 pb-3 text-xs text-gray-500"
                    >
                        Auctions ({auctions.length})
                    </a>

                    <a
                        href="#about"
                        className="shrink-0 pb-3 text-xs text-gray-500"
                    >
                        About
                    </a>

                    <a
                        href="#reviews"
                        className="shrink-0 pb-3 text-xs text-gray-500"
                    >
                        Reviews
                    </a>

                </div>


                {/* =================================================
                    DESKTOP TWO COLUMN CONTENT
                ================================================== */}

                <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">


                    {/* =================================================
                        LEFT
                    ================================================== */}

                    <div className="min-w-0">

                        {/* LISTINGS */}

                        <section id="listings">

                            <div className="mb-5 flex items-end justify-between">

                                <div>

                                    <h2 className="text-2xl font-bold text-[#252525]">
                                        Seller Listings
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Industrial assets currently listed
                                        by {sellerName}.
                                    </p>

                                </div>

                                <span className="hidden sm:block rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-500 shadow-sm">
                                    {listings.length} listings
                                </span>

                            </div>


                            {listings.length === 0 ? (

                                <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">

                                    <p className="text-3xl">
                                        📦
                                    </p>

                                    <p className="mt-3 font-semibold text-gray-800">
                                        No approved listings
                                    </p>

                                </div>

                            ) : (

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                                    {listings.map(
                                        (listing: any) => {

                                            const image =
                                                getListingImage(
                                                    listing
                                                );

                                            const auction =
                                                listing.auction;

                                            const isAuction =
                                                Boolean(
                                                    listing.isAuction &&
                                                    auction
                                                );

                                            const category =
                                                getCategoryName(
                                                    listing
                                                );

                                            const location =
                                                getListingLocation(
                                                    listing
                                                );

                                            const price =
                                                isAuction
                                                    ? auction?.currentBid
                                                    : listing.price;

                                            return (
                                                <Link
                                                    key={
                                                        listing.id
                                                    }
                                                    href={
                                                        isAuction
                                                            ? `/auctions/${auction.id}`
                                                            : `/listings/${listing.id}`
                                                    }
                                                    className="group"
                                                >

                                                    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg">


                                                        {/* IMAGE */}

                                                        <div className="relative h-52 overflow-hidden bg-gray-100">

                                                            {image ? (
                                                                <img
                                                                    src={
                                                                        image
                                                                    }
                                                                    alt={
                                                                        listing.title
                                                                    }
                                                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full items-center justify-center text-4xl">
                                                                    🏗️
                                                                </div>
                                                            )}


                                                            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold text-gray-800 shadow-sm">
                                                                {
                                                                    category
                                                                }
                                                            </span>


                                                            {listing.isSold && (
                                                                <span className="absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1.5 text-[10px] font-bold text-white">
                                                                    SOLD
                                                                </span>
                                                            )}


                                                            {isAuction && (
                                                                <span className="absolute bottom-3 left-3 rounded-full bg-[#f28c28] px-3 py-1.5 text-[10px] font-bold text-white">
                                                                    🔨{" "}
                                                                    {getAuctionLabel(
                                                                        auction
                                                                    )}
                                                                </span>
                                                            )}

                                                        </div>


                                                        {/* CONTENT */}

                                                        <div className="p-5">

                                                            <h3 className="line-clamp-2 text-lg font-bold text-[#252525]">
                                                                {
                                                                    listing.title
                                                                }
                                                            </h3>

                                                            {listing.description && (
                                                                <p className="mt-2 line-clamp-2 text-sm leading-5 text-gray-500">
                                                                    {
                                                                        listing.description
                                                                    }
                                                                </p>
                                                            )}

                                                            {location && (
                                                                <p className="mt-3 text-xs text-gray-500">
                                                                    📍{" "}
                                                                    {
                                                                        location
                                                                    }
                                                                </p>
                                                            )}


                                                            <div className="mt-5 border-t border-gray-100 pt-4">

                                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                                                    {isAuction
                                                                        ? "Current Bid"
                                                                        : "Price"}
                                                                </p>

                                                                <p className="mt-1 text-xl font-extrabold text-[#252525]">
                                                                    {formatPrice(
                                                                        price
                                                                    )}
                                                                </p>

                                                                {isAuction &&
                                                                    auction?.endDate && (
                                                                        <p className="mt-2 text-xs text-red-500">
                                                                            Ends{" "}
                                                                            {formatDate(
                                                                                auction.endDate
                                                                            )}
                                                                        </p>
                                                                    )}

                                                            </div>

                                                        </div>

                                                    </article>

                                                </Link>
                                            );
                                        }
                                    )}

                                </div>

                            )}

                        </section>


                        {/* =================================================
                            AUCTIONS
                        ================================================== */}

                        <section
                            id="auctions"
                            className="mt-12"
                        >

                            <div className="mb-5">

                                <h2 className="text-2xl font-bold text-[#252525]">
                                    Seller Auctions
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Auctions associated with this seller's
                                    listings.
                                </p>

                            </div>


                            {auctions.length === 0 ? (

                                <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">

                                    <p className="font-semibold text-gray-800">
                                        No auctions
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        This seller currently has no
                                        auction listings.
                                    </p>

                                </div>

                            ) : (

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                                    {auctions.map(
                                        (listing: any) => {

                                            const auction =
                                                listing.auction;

                                            const image =
                                                getListingImage(
                                                    listing
                                                );

                                            return (
                                                <Link
                                                    key={
                                                        auction.id
                                                    }
                                                    href={`/auctions/${auction.id}`}
                                                    className="group"
                                                >

                                                    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg">

                                                        <div className="relative h-48 overflow-hidden bg-gray-100">

                                                            {image ? (
                                                                <img
                                                                    src={
                                                                        image
                                                                    }
                                                                    alt={
                                                                        listing.title
                                                                    }
                                                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full items-center justify-center text-4xl">
                                                                    🔨
                                                                </div>
                                                            )}

                                                            <span className="absolute left-3 top-3 rounded-full bg-[#f28c28] px-3 py-1.5 text-[10px] font-bold text-white">
                                                                {getAuctionLabel(
                                                                    auction
                                                                )}
                                                            </span>

                                                        </div>


                                                        <div className="p-5">

                                                            <h3 className="font-bold text-lg text-[#252525]">
                                                                {
                                                                    listing.title
                                                                }
                                                            </h3>

                                                            <div className="mt-4 grid grid-cols-2 gap-4">

                                                                <div>
                                                                    <p className="text-[10px] uppercase tracking-wide text-gray-400">
                                                                        Current Bid
                                                                    </p>

                                                                    <p className="mt-1 font-bold text-[#252525]">
                                                                        {formatPrice(
                                                                            auction.currentBid
                                                                        )}
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    <p className="text-[10px] uppercase tracking-wide text-gray-400">
                                                                        Ends
                                                                    </p>

                                                                    <p className="mt-1 text-sm font-semibold text-red-500">
                                                                        {formatDate(
                                                                            auction.endDate
                                                                        )}
                                                                    </p>
                                                                </div>

                                                            </div>

                                                        </div>

                                                    </article>

                                                </Link>
                                            );
                                        }
                                    )}

                                </div>

                            )}

                        </section>


                        {/* =================================================
                            ABOUT
                        ================================================== */}

                        <section
                            id="about"
                            className="mt-12 rounded-xl border border-gray-200 bg-white p-6"
                        >

                            <h2 className="text-xl font-bold text-[#252525]">
                                About Seller
                            </h2>

                            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600">
                                {seller.about ||
                                    "No company description available."}
                            </p>

                        </section>


                        {/* =================================================
                            REVIEWS
                        ================================================== */}

                        <section
                            id="reviews"
                            className="mt-12 rounded-xl border border-gray-200 bg-white p-6"
                        >

                            <ReviewSection
                                sellerId={seller.id}
                            />

                        </section>

                    </div>


                    {/* =================================================
                        DESKTOP SIDEBAR
                    ================================================== */}

                    <aside className="hidden lg:block">

                        <div className="sticky top-6 space-y-5">


                            {/* SELLER INFO */}

                            <div className="rounded-xl border border-gray-200 bg-white p-5">

                                <h2 className="font-bold text-[#252525]">
                                    Seller Information
                                </h2>

                                <div className="mt-5 space-y-5">

                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                            Location
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-gray-800">
                                            {seller.location ||
                                                "Not provided"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                            Status
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-green-600">
                                            {seller.isApproved
                                                ? "✓ Verified Seller"
                                                : "Pending Verification"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                            Listings
                                        </p>

                                        <p className="mt-1 text-2xl font-bold text-[#252525]">
                                            {
                                                listings.length
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                            Auctions
                                        </p>

                                        <p className="mt-1 text-2xl font-bold text-[#252525]">
                                            {
                                                auctions.length
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                            Member Since
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-gray-800">
                                            {formatMemberSince(
                                                seller.createdAt
                                            )}
                                        </p>
                                    </div>

                                </div>

                            </div>


                            {/* CONTACT */}

                            <div className="rounded-xl border border-gray-200 bg-white p-5">

                                <h2 className="font-bold text-[#252525]">
                                    Contact Seller
                                </h2>

                                <div className="mt-4 space-y-2">

                                    {seller.whatsapp && (
                                        <a
                                            href={`https://wa.me/${seller.whatsapp.replace(/\D/g, "")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block rounded-lg bg-[#25D366] px-4 py-3 text-center text-sm font-semibold text-white"
                                        >
                                            WhatsApp Seller
                                        </a>
                                    )}

                                    {seller.phone && (
                                        <a
                                            href={`tel:${seller.phone}`}
                                            className="block rounded-lg border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700"
                                        >
                                            Call Seller
                                        </a>
                                    )}

                                    {seller.email && (
                                        <a
                                            href={`mailto:${seller.email}`}
                                            className="block rounded-lg border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700"
                                        >
                                            Send Email
                                        </a>
                                    )}

                                </div>

                            </div>

                        </div>

                    </aside>

                </div>


                {/* =================================================
                    MOBILE SELLER INFORMATION
                ================================================== */}

                <section className="mt-8 lg:hidden">

                    <div className="rounded-xl border border-gray-200 bg-white p-5">

                        <h2 className="font-bold text-[#252525]">
                            Seller Information
                        </h2>

                        <div className="mt-5 grid grid-cols-2 gap-5">

                            <div>
                                <p className="text-[10px] uppercase tracking-wide text-gray-400">
                                    Location
                                </p>

                                <p className="mt-1 text-sm font-semibold">
                                    {seller.location ||
                                        "Not provided"}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] uppercase tracking-wide text-gray-400">
                                    Listings
                                </p>

                                <p className="mt-1 text-xl font-bold">
                                    {listings.length}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] uppercase tracking-wide text-gray-400">
                                    Auctions
                                </p>

                                <p className="mt-1 text-xl font-bold">
                                    {auctions.length}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] uppercase tracking-wide text-gray-400">
                                    Status
                                </p>

                                <p className="mt-1 text-sm font-semibold text-green-600">
                                    {seller.isApproved
                                        ? "✓ Verified"
                                        : "Pending"}
                                </p>
                            </div>

                        </div>

                    </div>

                </section>

            </div>

        </main>
    );
}

// import Link from "next/link";
// import API_BASE_URL from "@/lib/api-config";
// import ListingSection from "@/components/ListingSection";
// import ReviewSection from "@/components/ReviewSection";

// async function getSeller(id: string) {
//     const res = await fetch(
//         `${API_BASE_URL}/api/sellers/profile/${id}`,
//         {
//             cache: "no-store",
//         }
//     );

//     if (!res.ok) {
//         throw new Error(
//             "Failed to fetch seller"
//         );
//     }

//     return res.json();
// }



// export default async function SellerPage({
//     params,
// }: {
//     params: Promise<{ id: string }>;
// }) {
//     const { id } = await params;

//     const seller = await getSeller(id);

//     return (
//         <div className="max-w-7xl mx-auto p-8">
//             <div className="mb-10">

//                 <h1 className="text-5xl font-bold">
//                     {seller.companyName || seller.name}
//                 </h1>

//                 <div className="flex items-center gap-3 mt-3">

//                     {seller.isApproved && (
//                         <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
//                             ✔ Verified Seller
//                         </span>
//                     )}

//                     <span className="text-gray-500">
//                         Member since{" "}
//                         {new Date(
//                             seller.createdAt
//                         ).toLocaleDateString()}
//                     </span>

//                 </div>

//             </div>

//             <p className="text-gray-500 mb-6">
//                 Member since{" "}
//                 {new Date(
//                     seller.createdAt
//                 ).toLocaleDateString()}
//             </p>

//             <div className="grid md:grid-cols-3 gap-6 mb-10">

//                 <div className="border rounded-xl p-6">

//                     <h3 className="text-gray-500">
//                         Location
//                     </h3>

//                     <p className="font-bold text-xl">
//                         {seller.location || "Nigeria"}
//                     </p>

//                 </div>

//                 <div className="border rounded-xl p-6">

//                     <h3 className="text-gray-500">
//                         Status
//                     </h3>

//                     <p className="font-bold text-xl text-green-600">
//                         {seller.isApproved
//                             ? "Verified"
//                             : "Pending"}
//                     </p>

//                 </div>

//                 <div className="border rounded-xl p-6">

//                     <h3 className="text-gray-500">
//                         Listings
//                     </h3>

//                     <p className="font-bold text-xl">
//                         {seller.listings.length}
//                     </p>

//                 </div>

//             </div>

//             <div className="border rounded-xl p-6 mb-8">
//                 <h2 className="text-2xl font-bold mb-3">
//                     About Seller
//                 </h2>

//                 <p>
//                     {seller.about ||
//                         "No company description yet."}
//                 </p>
//             </div>

//             <div className="flex gap-4 mt-6">
//                 {seller.whatsapp && (
//                     <a
//                         href={`https://wa.me/${seller.whatsapp}`}
//                         className="bg-green-600 text-white px-6 py-3 rounded-xl"
//                     >
//                         WhatsApp
//                     </a>
//                 )}

//                 {seller.email && (
//                     <a
//                         href={`mailto:${seller.email}`}
//                         className="bg-blue-600 text-white px-6 py-3 rounded-xl"
//                     >
//                         Email
//                     </a>
//                 )}

//             </div>

//             <h2 className="text-2xl font-bold mb-6">
//                 Listings
//             </h2>
//             <ListingSection
//                 title="Seller Listings"
//                 link="/listings"
//                 listings={seller.listings}
//             />

          

//             <ReviewSection sellerId={seller.id} />

            

//         </div>
//     );
// }