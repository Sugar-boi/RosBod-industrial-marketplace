"use client";

import { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/api-config";
import ListingCard from "@/components/ListingCard";

export default function FavoritesPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to see your favorites.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE_URL}/api/favorites/my-favorites`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to load favorites");
        }

        const data = await res.json();

        // API returns array of { listing: {...} }
        const list = Array.isArray(data)
          ? data.map((f: any) => f.listing).filter(Boolean)
          : [];

        setListings(list);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-6">
        <p className="text-gray-500">Loading favorites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <h1 className="text-4xl font-bold mb-2">❤️ Favorites</h1>
      <p className="text-gray-500 mb-10">Your saved listings.</p>

      {!listings.length ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">
            No favorites yet.
          </h2>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
          {listings.map((listing: any) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}

// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";

// import API_BASE_URL from "@/lib/api-config";
// import { getFavorites } from "@/lib/favorites";

// type Listing = {
//   id: number;
//   title?: string;
//   description?: string;
//   price?: number | string;
//   status?: string;
//   isApproved?: boolean;
//   isAuction?: boolean;

//   images?: {
//     id?: number;
//     imageUrl?: string;
//   }[];

//   listingimage?: {
//     id?: number;
//     imageUrl?: string;
//   }[];

//   category?: {
//     id?: number;
//     name?: string;
//     category?: {
//       id?: number;
//       name?: string;
//     };
//   };

//   seller?: {
//     id?: number;
//     name?: string;
//     isApproved?: boolean;
//   };

//   user?: {
//     id?: number;
//     name?: string;
//     isApproved?: boolean;
//   };

//   auction?: {
//     id?: number;
//     status?: string;
//     startingBid?: number | string;
//     currentBid?: number | string;
//     startDate?: string;
//     endDate?: string;
//     buyNowPrice?: number | string;
//   } | null;

//   equipmentDetails?: {
//     state?: string;
//     city?: string;
//   } | null;

//   propertyDetails?: {
//     state?: string;
//     city?: string;
//   } | null;

//   quarryDetails?: {
//     state?: string;
//     city?: string;
//   } | null;

//   sparepartDetails?: {
//     state?: string;
//     city?: string;
//   } | null;
// };

// function getImage(listing: Listing) {
//   const images =
//     listing.images?.length
//       ? listing.images
//       : listing.listingimage || [];

//   return images[0]?.imageUrl || null;
// }

// function getCategory(listing: Listing) {
//   return (
//     listing.category?.category?.name ||
//     listing.category?.name ||
//     "Industrial Asset"
//   );
// }

// function getLocation(listing: Listing) {
//   const details =
//     listing.equipmentDetails ||
//     listing.propertyDetails ||
//     listing.quarryDetails ||
//     listing.sparepartDetails;

//   if (!details) {
//     return null;
//   }

//   if ("city" in details && "state" in details) {
//     if (details.city && details.state) {
//       return `${details.city}, ${details.state}`;
//     }

//     return details.city || details.state || null;
//   }

//   return null;
// }

// function getSeller(listing: Listing) {
//   return listing.seller || listing.user || null;
// }

// function formatMoney(value: number | string | undefined) {
//   if (
//     value === undefined ||
//     value === null ||
//     value === ""
//   ) {
//     return "Price on request";
//   }

//   const number = Number(value);

//   if (Number.isNaN(number)) {
//     return String(value);
//   }

//   return `₦${number.toLocaleString("en-NG")}`;
// }

// function getAuctionStatus(
//   auction: Listing["auction"]
// ) {
//   if (!auction) {
//     return null;
//   }

//   if (auction.status === "LIVE") {
//     return "LIVE";
//   }

//   if (auction.status === "SCHEDULED") {
//     return "UPCOMING";
//   }

//   if (auction.status === "ENDED") {
//     return "ENDED";
//   }

//   if (auction.status === "SOLD") {
//     return "SOLD";
//   }

//   return auction.status || "AUCTION";
// }

// function getTimeLeft(
//   endDate?: string
// ) {
//   if (!endDate) {
//     return null;
//   }

//   const difference =
//     new Date(endDate).getTime() -
//     Date.now();

//   if (difference <= 0) {
//     return "Ended";
//   }

//   const hours = Math.floor(
//     difference / (1000 * 60 * 60)
//   );

//   const days = Math.floor(hours / 24);

//   const remainingHours =
//     hours % 24;

//   if (days > 0) {
//     return `${days}d ${remainingHours}h`;
//   }

//   return `${remainingHours}h`;
// }

// export default function FavoritesPage() {
//   const [listings, setListings] =
//     useState<Listing[]>([]);

//   const [activeTab, setActiveTab] =
//     useState<"listings" | "auctions">(
//       "listings"
//     );

//   const [search, setSearch] =
//     useState("");

//   const [loading, setLoading] =
//     useState(true);

//   const [selectedForCompare, setSelectedForCompare] =
//     useState<number[]>([]);

//   useEffect(() => {
//     loadFavorites();
//   }, []);

//   const loadFavorites = async () => {
//     try {
//       setLoading(true);

//       const ids = getFavorites();

//       if (!ids.length) {
//         setListings([]);
//         return;
//       }

//       const res = await fetch(
//         `${API_BASE_URL}/api/listings/by-ids`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type":
//               "application/json",
//           },
//           body: JSON.stringify({
//             ids,
//           }),
//         }
//       );

//       if (!res.ok) {
//         throw new Error(
//           "Failed to load saved listings"
//         );
//       }

//       const data = await res.json();

//       setListings(
//         Array.isArray(data)
//           ? data
//           : []
//       );
//     } catch (error) {
//       console.error(
//         "Failed to load favorites:",
//         error
//       );

//       setListings([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeFavorite = (
//     id: number
//   ) => {
//     const currentIds = getFavorites();

//     const updatedIds =
//       currentIds.filter(
//         (favoriteId: number) =>
//           favoriteId !== id
//       );

//     localStorage.setItem(
//       "favorites",
//       JSON.stringify(updatedIds)
//     );

//     setListings((current) =>
//       current.filter(
//         (listing) =>
//           listing.id !== id
//       )
//     );

//     setSelectedForCompare(
//       (current) =>
//         current.filter(
//           (selectedId) =>
//             selectedId !== id
//         )
//     );
//   };

//   const toggleCompare = (
//     id: number
//   ) => {
//     setSelectedForCompare(
//       (current) => {
//         if (
//           current.includes(id)
//         ) {
//           return current.filter(
//             (item) =>
//               item !== id
//           );
//         }

//         if (current.length >= 2) {
//           return current;
//         }

//         return [
//           ...current,
//           id,
//         ];
//       }
//     );
//   };

//   const filteredListings =
//     useMemo(() => {
//       const value =
//         search
//           .trim()
//           .toLowerCase();

//       if (!value) {
//         return listings;
//       }

//       return listings.filter(
//         (listing) => {
//           const category =
//             getCategory(
//               listing
//             );

//           const location =
//             getLocation(
//               listing
//             ) || "";

//           return (
//             listing.title
//               ?.toLowerCase()
//               .includes(value) ||
//             category
//               .toLowerCase()
//               .includes(value) ||
//             location
//               .toLowerCase()
//               .includes(value)
//           );
//         }
//       );
//     }, [listings, search]);

//   /*
//    * The current backend returns an auction
//    * alongside a listing where one exists.
//    *
//    * Since the current frontend favorite
//    * system stores listing IDs, these are the
//    * saved auction items we can reliably derive
//    * without inventing a new backend endpoint.
//    */
//   const savedAuctions =
//     useMemo(() => {
//       return listings.filter(
//         (listing) =>
//           listing.auction
//       );
//     }, [listings]);

//   return (
//     <main className="min-h-screen bg-[#f7f7f5]">
//       <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">

//         {/* PAGE HEADER */}

//         <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

//           <div>
//             <h1 className="text-2xl font-extrabold tracking-tight text-[#24272b] sm:text-3xl">
//               Saved Listings
//             </h1>

//             <p className="mt-1 text-sm text-gray-500">
//               {listings.length}{" "}
//               saved{" "}
//               {listings.length === 1
//                 ? "item"
//                 : "items"}
//             </p>
//           </div>

//           <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">

//             <div className="relative w-full sm:w-64">

//               <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//                 ⌕
//               </span>

//               <input
//                 value={search}
//                 onChange={(event) =>
//                   setSearch(
//                     event.target.value
//                   )
//                 }
//                 placeholder="Search saved..."
//                 className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-[#ff9900] focus:ring-2 focus:ring-orange-100"
//               />

//             </div>

//             <button
//               type="button"
//               disabled={
//                 selectedForCompare.length !==
//                 2
//               }
//               className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:border-[#ff9900] disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               Compare (
//               {
//                 selectedForCompare.length
//               }
//               )
//             </button>

//           </div>
//         </div>

//         {/* SAVED LISTINGS */}

//         <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">

//           {/* TABS */}

//           <div className="flex border-b border-gray-200">

//             <button
//               type="button"
//               onClick={() =>
//                 setActiveTab(
//                   "listings"
//                 )
//               }
//               className={`border-b-2 px-4 py-3 text-sm font-semibold transition sm:px-5 ${activeTab ===
//                   "listings"
//                   ? "border-[#ff9900] text-[#202226]"
//                   : "border-transparent text-gray-500 hover:text-gray-800"
//                 }`}
//             >
//               Saved Listings

//               <span className="ml-2 rounded-md bg-gray-100 px-2 py-0.5 text-xs">
//                 {
//                   listings.length
//                 }
//               </span>
//             </button>

//             <button
//               type="button"
//               onClick={() =>
//                 setActiveTab(
//                   "auctions"
//                 )
//               }
//               className={`border-b-2 px-4 py-3 text-sm font-semibold transition sm:px-5 ${activeTab ===
//                   "auctions"
//                   ? "border-[#ff9900] text-[#202226]"
//                   : "border-transparent text-gray-500 hover:text-gray-800"
//                 }`}
//             >
//               Saved Auctions

//               <span className="ml-2 rounded-md bg-gray-100 px-2 py-0.5 text-xs">
//                 {
//                   savedAuctions.length
//                 }
//               </span>
//             </button>

//           </div>

//           <div className="p-4 sm:p-5">

//             {activeTab ===
//               "listings" ? (
//               <>
//                 {loading ? (
//                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
//                     {[1, 2, 3].map(
//                       (
//                         item
//                       ) => (
//                         <div
//                           key={
//                             item
//                           }
//                           className="h-80 animate-pulse rounded-xl bg-gray-100"
//                         />
//                       )
//                     )}
//                   </div>
//                 ) : filteredListings.length ===
//                   0 ? (
//                   <div className="py-16 text-center">

//                     <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-2xl">
//                       ♡
//                     </div>

//                     <h2 className="text-lg font-bold text-[#202226]">
//                       {search
//                         ? "No saved listings found"
//                         : "No saved listings yet"}
//                     </h2>

//                     <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
//                       {search
//                         ? "Try a different search."
//                         : "Listings you save will appear here."}
//                     </p>

//                     {!search && (
//                       <Link
//                         href="/listings"
//                         className="mt-5 inline-flex rounded-lg bg-[#ff9900] px-5 py-2.5 text-sm font-bold text-[#202226]"
//                       >
//                         Browse Listings
//                       </Link>
//                     )}

//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

//                     {filteredListings.map(
//                       (
//                         listing
//                       ) => {
//                         const image =
//                           getImage(
//                             listing
//                           );

//                         const category =
//                           getCategory(
//                             listing
//                           );

//                         const location =
//                           getLocation(
//                             listing
//                           );

//                         const seller =
//                           getSeller(
//                             listing
//                           );

//                         const isCompared =
//                           selectedForCompare.includes(
//                             listing.id
//                           );

//                         return (
//                           <article
//                             key={
//                               listing.id
//                             }
//                             className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
//                           >

//                             {/* IMAGE */}

//                             <div className="relative h-48 overflow-hidden bg-gray-100 sm:h-52">

//                               {image ? (
//                                 <img
//                                   src={
//                                     image
//                                   }
//                                   alt={
//                                     listing.title ||
//                                     "Saved listing"
//                                   }
//                                   className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
//                                 />
//                               ) : (
//                                 <div className="flex h-full items-center justify-center text-sm text-gray-400">
//                                   No image
//                                 </div>
//                               )}

//                               <span className="absolute left-3 top-3 rounded-md bg-[#202226] px-2 py-1 text-xs font-bold text-white">
//                                 {
//                                   category
//                                 }
//                               </span>

//                               {/* FAVORITE */}

//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   removeFavorite(
//                                     listing.id
//                                   )
//                                 }
//                                 aria-label="Remove saved listing"
//                                 className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md bg-white text-lg text-red-400 shadow-sm transition hover:bg-red-50"
//                               >
//                                 ♥
//                               </button>

//                             </div>

//                             {/* DETAILS */}

//                             <div className="p-3 sm:p-4">

//                               <p className="mb-1 text-xs text-gray-500">
//                                 {category}
//                               </p>

//                               <Link
//                                 href={`/listings/${listing.id}`}
//                                 className="line-clamp-2 text-sm font-extrabold text-[#202226] hover:text-[#d97706]"
//                               >
//                                 {
//                                   listing.title
//                                 }
//                               </Link>

//                               {location && (
//                                 <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
//                                   <span>
//                                     📍
//                                   </span>

//                                   {
//                                     location
//                                   }

//                                   {seller?.isApproved && (
//                                     <span className="ml-1 inline-flex items-center rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
//                                       ✓ Verified
//                                     </span>
//                                   )}
//                                 </p>
//                               )}

//                               {!location &&
//                                 seller?.isApproved && (
//                                   <span className="mt-2 inline-flex rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
//                                     ✓ Verified
//                                   </span>
//                                 )}

//                               <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">

//                                 <p className="text-sm font-extrabold text-[#202226]">
//                                   {formatMoney(
//                                     listing.price
//                                   )}
//                                 </p>

//                                 <div className="flex items-center gap-2">

//                                   <button
//                                     type="button"
//                                     onClick={() =>
//                                       toggleCompare(
//                                         listing.id
//                                       )
//                                     }
//                                     className={`h-8 rounded-md border px-2.5 text-xs font-semibold ${isCompared
//                                         ? "border-[#ff9900] bg-orange-50 text-[#d97706]"
//                                         : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
//                                       }`}
//                                   >
//                                     {isCompared
//                                       ? "Selected"
//                                       : "Compare"}
//                                   </button>

//                                   <Link
//                                     href={`/listings/${listing.id}`}
//                                     className="h-8 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-gray-300"
//                                   >
//                                     View
//                                   </Link>

//                                 </div>

//                               </div>

//                             </div>

//                           </article>
//                         );
//                       }
//                     )}

//                   </div>
//                 )}
//               </>
//             ) : (
//               /* SAVED AUCTIONS */

//               <div>

//                 {savedAuctions.length ===
//                   0 ? (
//                   <div className="py-16 text-center">

//                     <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-2xl">
//                       ⚒
//                     </div>

//                     <h2 className="text-lg font-bold text-[#202226]">
//                       No saved auctions
//                     </h2>

//                     <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
//                       Saved auction listings will appear here when they are available.
//                     </p>

//                     <Link
//                       href="/auctions"
//                       className="mt-5 inline-flex rounded-lg bg-[#ff9900] px-5 py-2.5 text-sm font-bold text-[#202226]"
//                     >
//                       Browse Auctions
//                     </Link>

//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

//                     {savedAuctions.map(
//                       (
//                         listing
//                       ) => {
//                         const auction =
//                           listing.auction!;

//                         const image =
//                           getImage(
//                             listing
//                           );

//                         const status =
//                           getAuctionStatus(
//                             auction
//                           );

//                         const timeLeft =
//                           getTimeLeft(
//                             auction.endDate
//                           );

//                         const currentBid =
//                           auction.currentBid ??
//                           auction.startingBid;

//                         return (
//                           <article
//                             key={
//                               listing.id
//                             }
//                             className="overflow-hidden rounded-xl border border-gray-200 bg-white"
//                           >

//                             <Link
//                               href={
//                                 auction.id
//                                   ? `/auctions/${auction.id}`
//                                   : `/listings/${listing.id}`
//                               }
//                               className="block"
//                             >

//                               <div className="relative h-44 overflow-hidden bg-gray-100">

//                                 {image ? (
//                                   <img
//                                     src={
//                                       image
//                                     }
//                                     alt={
//                                       listing.title ||
//                                       "Auction"
//                                     }
//                                     className="h-full w-full object-cover"
//                                   />
//                                 ) : (
//                                   <div className="flex h-full items-center justify-center text-sm text-gray-400">
//                                     No image
//                                   </div>
//                                 )}

//                                 {status && (
//                                   <span
//                                     className={`absolute left-3 top-3 rounded-md px-2 py-1 text-xs font-extrabold ${status ===
//                                         "LIVE"
//                                         ? "bg-green-100 text-green-700"
//                                         : status ===
//                                           "UPCOMING"
//                                           ? "bg-blue-100 text-blue-700"
//                                           : "bg-gray-100 text-gray-700"
//                                       }`}
//                                   >
//                                     •{" "}
//                                     {
//                                       status
//                                     }
//                                   </span>
//                                 )}

//                                 <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md bg-white text-red-400 shadow-sm">
//                                   ♥
//                                 </span>

//                               </div>

//                               <div className="p-4">

//                                 <h3 className="font-extrabold text-[#202226]">
//                                   {
//                                     listing.title
//                                   }
//                                 </h3>

//                                 <div className="mt-3 flex items-center justify-between">

//                                   <div>
//                                     <p className="text-xs text-gray-500">
//                                       Current bid
//                                     </p>

//                                     <p className="font-extrabold text-[#202226]">
//                                       {formatMoney(
//                                         currentBid
//                                       )}
//                                     </p>
//                                   </div>

//                                   {timeLeft && (
//                                     <div className="text-right">
//                                       <p className="text-xs text-gray-500">
//                                         Ends in
//                                       </p>

//                                       <p className="font-bold text-[#202226]">
//                                         {
//                                           timeLeft
//                                         }
//                                       </p>
//                                     </div>
//                                   )}

//                                 </div>

//                               </div>

//                             </Link>

//                             <div className="border-t border-gray-100 p-4">

//                               <Link
//                                 href={
//                                   auction.id
//                                     ? `/auctions/${auction.id}`
//                                     : `/listings/${listing.id}`
//                                 }
//                                 className="block w-full rounded-lg bg-[#ff9900] px-4 py-2.5 text-center text-sm font-extrabold text-[#202226]"
//                               >
//                                 {status ===
//                                   "LIVE"
//                                   ? "Place Bid"
//                                   : "View Auction"}
//                               </Link>

//                             </div>

//                           </article>
//                         );
//                       }
//                     )}

//                   </div>
//                 )}

//               </div>
//             )}

//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }

// // "use client";

// // import { useEffect, useState } from "react";

// // import API_BASE_URL from "@/lib/api-config";

// // import ListingCard from "@/components/ListingCard";

// // import { getFavorites } from "@/lib/favorites";

// // export default function FavoritesPage() {

// //   const [listings, setListings] = useState([]);

// //   useEffect(() => {

// //     const ids = getFavorites();

// //     if (!ids.length) return;

// //     fetch(
// //       `${API_BASE_URL}/api/listings/by-ids`,
// //       {

// //         method: "POST",

// //         headers: {
// //           "Content-Type":
// //             "application/json",
// //         },

// //         body: JSON.stringify({
// //           ids,
// //         }),

// //       }
// //     )
// //       .then(res => res.json())
// //       .then(setListings);

// //   }, []);

// //   return (

// //     <div className="max-w-7xl mx-auto py-10 px-6">

// //       <h1 className="text-4xl font-bold mb-2">
// //         ❤️ Favorites
// //       </h1>

// //       <p className="text-gray-500 mb-10">
// //         Your saved listings.
// //       </p>

// //       {!listings.length ? (

// //         <div className="text-center py-20">

// //           <h2 className="text-2xl font-semibold">
// //             No favorites yet.
// //           </h2>

// //         </div>

// //       ) : (

// //         <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">

// //           {listings.map((listing: any) => (

// //             <ListingCard
// //               key={listing.id}
// //               listing={listing}
// //             />

// //           ))}

// //         </div>

// //       )}

// //     </div>

// //   );

// // }