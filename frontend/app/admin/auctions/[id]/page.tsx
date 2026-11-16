// "use client";

// import {
//   useEffect,
//   useState,
// } from "react";

// import {
//   useParams,
// } from "next/navigation";

// import API_BASE_URL from "@/lib/api-config";

// export default function AdminAuctionDetailsPage() {

//   const { id } =
//     useParams();

//   const [
//     auction,
//     setAuction,
//   ] = useState<any>(null);

//   const [
//     loading,
//     setLoading,
//   ] = useState(true);

//   useEffect(() => {

//     const loadAuction =
//       async () => {

//         try {

//           const res =
//             await fetch(
//               `${API_BASE_URL}/api/auctions/${id}`
//             );

//           const data =
//             await res.json();

//           if (!res.ok) {

//             throw new Error(
//               data.message ||
//               "Failed to load auction"
//             );

//           }

//           setAuction(data);

//         } catch (error) {

//           console.error(
//             "Failed to load auction:",
//             error
//           );

//         } finally {

//           setLoading(false);

//         }

//       };

//     if (id) {

//       loadAuction();

//     }

//   }, [id]);

//   if (loading) {

//     return (

//       <div className="p-10">

//         Loading auction...

//       </div>

//     );

//   }

//   if (!auction) {

//     return (

//       <div className="p-10">

//         Auction not found.

//       </div>

//     );

//   }

//   return (

//     <div className="max-w-6xl mx-auto p-8">

//       <div className="mb-8">

//         <p className="text-sm text-gray-500">

//           Admin Auction Review

//         </p>

//         <h1 className="text-4xl font-bold mt-2">

//           {
//             auction.listing?.title
//           }

//         </h1>

//       </div>

//       <div className="grid lg:grid-cols-2 gap-8">

//         {/* Images */}

//         <div>

//           {auction.listing
//             ?.images?.[0] ? (

//             <img
//               src={
//                 auction.listing
//                   .images[0]
//                   .imageUrl
//               }
//               alt={
//                 auction.listing
//                   ?.title
//               }
//               className="w-full h-[450px] object-cover rounded-2xl"
//             />

//           ) : (

//             <div className="w-full h-[450px] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">

//               No image available

//             </div>

//           )}

//         </div>

//         {/* Listing information */}

//         <div className="space-y-6">

//           <div className="border rounded-xl p-5">

//             <p className="text-sm text-gray-500">

//               Category

//             </p>

//             <p className="font-bold">

//               {
//                 auction.listing
//                   ?.category?.name ||
//                 "No category"
//               }

//             </p>

//           </div>

//           <div className="border rounded-xl p-5">

//             <p className="text-sm text-gray-500">

//               Seller

//             </p>

//             <p className="font-bold">

//               {
//                 auction.listing
//                   ?.seller?.name ||
//                 "Unknown seller"
//               }

//             </p>

//             <p className="text-gray-500">

//               {
//                 auction.listing
//                   ?.seller?.email
//               }

//             </p>

//           </div>

//           <div className="border rounded-xl p-5">

//             <p className="text-sm text-gray-500">

//               Description

//             </p>

//             <p className="mt-2">

//               {
//                 auction.listing
//                   ?.description
//               }

//             </p>

//           </div>

//         </div>

//       </div>

//       {/* Auction details */}

//       <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">

//         <div className="border rounded-xl p-5">

//           <p className="text-sm text-gray-500">

//             Starting Bid

//           </p>

//           <p className="text-xl font-bold">

//             ₦
//             {Number(
//               auction.startingBid
//             ).toLocaleString()}

//           </p>

//         </div>

//         <div className="border rounded-xl p-5">

//           <p className="text-sm text-gray-500">

//             Current Bid

//           </p>

//           <p className="text-xl font-bold">

//             ₦
//             {Number(
//               auction.currentBid
//             ).toLocaleString()}

//           </p>

//         </div>

//         <div className="border rounded-xl p-5">

//           <p className="text-sm text-gray-500">

//             Minimum Increment

//           </p>

//           <p className="text-xl font-bold">

//             ₦
//             {Number(
//               auction.minimumIncrement
//             ).toLocaleString()}

//           </p>

//         </div>

//         <div className="border rounded-xl p-5">

//           <p className="text-sm text-gray-500">

//             Total Bids

//           </p>

//           <p className="text-xl font-bold">

//             {
//               auction.bids
//                 ?.length || 0
//             }

//           </p>

//         </div>

//       </div>

//       {/* Dates */}

//       <div className="border rounded-xl p-6 mt-8">

//         <h2 className="text-2xl font-bold mb-5">

//           Auction Schedule

//         </h2>

//         <p>

//           <strong>
//             Starts:
//           </strong>

//           {" "}

//           {
//             new Date(
//               auction.startDate
//             ).toLocaleString()
//           }

//         </p>

//         <p className="mt-3">

//           <strong>
//             Ends:
//           </strong>

//           {" "}

//           {
//             new Date(
//               auction.endDate
//             ).toLocaleString()
//           }

//         </p>

//       </div>

//       {/* Approval status */}

//       <div className="border rounded-xl p-6 mt-8">

//         <h2 className="text-2xl font-bold">

//           Approval Status

//         </h2>

//         <p className="mt-3">

//           {
//             auction.listing
//               ?.isApproved
//               ? "This auction listing is approved."
//               : "This auction is waiting for admin approval."
//           }

//         </p>

//       </div>

//     </div>

//   );

// }
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import API_BASE_URL from "@/lib/api-config";

export default function AdminAuctionDetailsPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [auction, setAuction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (!id) return;

    const loadAuction = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE_URL}/api/auctions/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load auction");
        }

        setAuction(data);
        setCurrentImage(0);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load auction");
      } finally {
        setLoading(false);
      }
    };

    loadAuction();
  }, [id]);

  const listing = auction?.listing;
  const seller = listing?.seller || listing?.user;

  const images = useMemo(() => {
    if (!listing) return [];
    return listing.images || listing.listingimage || [];
  }, [listing]);

  const bids = useMemo(() => {
    if (!auction) return [];
    return auction.bids || auction.bid || [];
  }, [auction]);

  const money = (n: any) => `₦${Number(n || 0).toLocaleString()}`;

  const formatDateTime = (value?: string) => {
    if (!value) return "—";
    return new Date(value).toLocaleString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const auctionStatus = (auction?.status || "—").toUpperCase();
  const listingApproved =
    listing?.isApproved === true || listing?.status === "APPROVED";

  const auctionBadgeClass =
    auctionStatus === "LIVE"
      ? "bg-green-50 text-green-700 border-green-200"
      : auctionStatus === "ENDED" || auctionStatus === "SOLD"
        ? "bg-slate-100 text-slate-700 border-slate-200"
        : auctionStatus === "SCHEDULED"
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "bg-orange-50 text-orange-700 border-orange-200";

  if (loading) {
    return (
      <div className="min-h-[50vh] bg-[#f7f7f5] p-6 sm:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="h-8 w-56 animate-pulse rounded bg-gray-200" />
          <div className="mt-6 h-80 animate-pulse rounded-2xl border border-gray-200 bg-white" />
        </div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="min-h-[50vh] bg-[#f7f7f5] p-6 sm:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error || "Auction not found."}
          </div>
          <Link
            href="/admin/auctions"
            className="mt-4 inline-flex text-sm font-semibold text-[#d97706] hover:underline"
          >
            ← Back to auctions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <Link href="/admin" className="hover:text-[#d97706]">
            Admin
          </Link>
          <span>/</span>
          <Link href="/admin/auctions" className="hover:text-[#d97706]">
            Auctions
          </Link>
          <span>/</span>
          <span className="font-semibold text-gray-700">#{auction.id}</span>
        </div>

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d97706]">
              Admin auction review
            </p>
            <h1 className="mt-1 text-2xl font-extrabold text-[#24272b] sm:text-3xl">
              {listing?.title || "Untitled auction"}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {listing?.category?.name || "Uncategorized"}
              {seller?.name ? ` · ${seller.name}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${auctionBadgeClass}`}
            >
              {auctionStatus}
            </span>
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${listingApproved
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-orange-200 bg-orange-50 text-orange-700"
                }`}
            >
              {listingApproved ? "Listing approved" : "Listing pending"}
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
          {/* Gallery */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="aspect-[16/10] bg-gray-100">
              {images.length > 0 ? (
                <img
                  src={images[currentImage]?.imageUrl}
                  alt={listing?.title || "Auction"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                  No image available
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

          {/* Side summary */}
          <div className="space-y-5">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                Current bid
              </p>
              <p className="mt-1 text-3xl font-extrabold text-[#24272b]">
                {money(auction.currentBid)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Starting {money(auction.startingBid)} · Increment{" "}
                {money(auction.minimumIncrement)}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-100 bg-[#fafaf9] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                    Bids
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-[#24272b]">
                    {bids.length}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-[#fafaf9] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                    Reserve
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-[#24272b]">
                    {auction.reservePrice != null
                      ? money(auction.reservePrice)
                      : "—"}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-[#24272b]">Seller</h2>
              <p className="mt-2 font-semibold text-[#24272b]">
                {seller?.name || "Unknown seller"}
              </p>
              <p className="text-sm text-gray-500">{seller?.email || "—"}</p>
              {seller?.phone && (
                <p className="mt-1 text-sm text-gray-500">{seller.phone}</p>
              )}

              <div className="mt-4 flex flex-col gap-2">
                {listing?.id && (
                  <Link
                    href={`/listings/${listing.id}`}
                    className="inline-flex items-center justify-center rounded-xl bg-[#ff9900] px-4 py-3 text-sm font-extrabold text-[#24272b] transition hover:bg-[#ffad28]"
                  >
                    View public listing
                  </Link>
                )}
                <Link
                  href="/admin/auctions"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Back to auctions
                </Link>
              </div>
            </section>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Starting bid", value: money(auction.startingBid) },
            { label: "Current bid", value: money(auction.currentBid) },
            {
              label: "Min increment",
              value: money(auction.minimumIncrement),
            },
            {
              label: "Buy now",
              value:
                auction.buyNowPrice != null
                  ? money(auction.buyNowPrice)
                  : "—",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                {item.label}
              </p>
              <p className="mt-2 text-lg font-extrabold text-[#24272b]">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Schedule + terms */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-bold text-[#24272b]">
              Auction schedule
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Starts</span>
                <span className="font-semibold text-[#24272b]">
                  {formatDateTime(auction.startDate)}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Ends</span>
                <span className="font-semibold text-[#24272b]">
                  {formatDateTime(auction.endDate)}
                </span>
              </div>
              {auction.inspectionDate && (
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Inspection</span>
                  <span className="font-semibold text-[#24272b]">
                    {formatDateTime(auction.inspectionDate)}
                  </span>
                </div>
              )}
            </div>

            {(auction.inspectionAddress ||
              auction.inspectionCity ||
              auction.inspectionState) && (
                <div className="mt-5 rounded-xl bg-[#fafaf9] p-3 text-sm text-gray-600">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                    Inspection location
                  </p>
                  <p className="mt-1">
                    {[
                      auction.inspectionAddress,
                      auction.inspectionCity,
                      auction.inspectionState,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-bold text-[#24272b]">
              Listing details
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">
              {listing?.description || "No description provided."}
            </p>

            {(auction.paymentTerms || auction.terms) && (
              <div className="mt-5 space-y-3 border-t border-gray-100 pt-4 text-sm text-gray-600">
                {auction.paymentTerms && (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                      Payment terms
                    </p>
                    <p className="mt-1">{auction.paymentTerms}</p>
                  </div>
                )}
                {auction.terms && (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                      Auction terms
                    </p>
                    <p className="mt-1">{auction.terms}</p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Bids table */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="text-sm font-bold text-[#24272b]">Bids</h2>
              <p className="text-xs text-gray-500">
                {bids.length} bid{bids.length === 1 ? "" : "s"} recorded
              </p>
            </div>
          </div>

          {bids.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-gray-500">
              No bids yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-[#fafaf9] text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Bidder</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[...bids]
                    .sort(
                      (a: any, b: any) =>
                        Number(b.amount || 0) - Number(a.amount || 0)
                    )
                    .map((bid: any) => (
                      <tr key={bid.id} className="hover:bg-[#fffaf3]">
                        <td className="px-4 py-3 font-semibold text-[#24272b]">
                          {bid.user?.name ||
                            bid.bidder?.name ||
                            `User #${bid.userId || "—"}`}
                        </td>
                        <td className="px-4 py-3 font-bold">
                          {money(bid.amount)}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {formatDateTime(bid.createdAt)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}