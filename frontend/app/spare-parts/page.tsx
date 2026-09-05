"use client";

import { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/api-config";
import ListingSection from "@/components/ListingSection";

export default function SparePartsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        const [listingsRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/listings`),
          fetch(`${API_BASE_URL}/api/categories`),
        ]);

        const data = await listingsRes.json();
        const categoriesData = await categoriesRes.json();

        const categories = Array.isArray(categoriesData)
          ? categoriesData
          : categoriesData?.categories || [];

        const getParentName = (listing: any) => {
          const cat = listing.category;
          if (!cat) return "";

          if (cat.parent?.name) return cat.parent.name;

          if (cat.parentId) {
            const parent = categories.find(
              (c: any) => c.id === cat.parentId
            );
            return parent?.name || "";
          }

          // listing category itself is a top-level parent
          return cat.name || "";
        };

        const all = Array.isArray(data) ? data : [];

        const sparePartsListings = all.filter((listing: any) => {
          const parentName = getParentName(listing);
          // match real DB name (adjust if yours differs)
          return (
            parentName === "Spare Parts" ||
            parentName.toLowerCase().includes("spare")
          );
        });

        setListings(sparePartsListings);
      } catch (error) {
        console.error("Failed to fetch spare parts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpareParts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] p-10">
        Loading spare parts...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5]">

      <section className="bg-[#24272b] px-5 py-16 text-white">
        <div className="mx-auto max-w-[1440px]">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff9900]">
            Rosebod Marketplace
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Industrial Spare Parts
          </h1>

          <p className="mt-4 max-w-2xl text-gray-300">
            Browse spare parts for excavators,
            bulldozers, crushers, generators,
            trucks, loaders and other industrial
            machinery.
          </p>

        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12">

        {listings.length > 0 ? (
          <ListingSection
            title="Available Spare Parts"
            link="/spare-parts"
            listings={listings}
            limit={100}
          />
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">

            <h2 className="text-2xl font-bold text-[#24272b]">
              No Spare Parts Available Yet
            </h2>

            <p className="mt-3 text-gray-500">
              Spare-parts listings will appear here
              when sellers publish them.
            </p>

          </div>
        )}

      </div>

    </main>
  );
}