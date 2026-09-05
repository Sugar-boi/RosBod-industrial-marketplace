"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import API_BASE_URL from "@/lib/api-config";

const PARENT_NAME = "Properties"; // must match DB parent category name

export default function EquipmentPage() {
    const [listings, setListings] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedSubId, setSelectedSubId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);

                const [listRes, catRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/listings`),
                    fetch(`${API_BASE_URL}/api/categories`),
                ]);

                const listData = await listRes.json();
                const catData = await catRes.json();

                setListings(Array.isArray(listData) ? listData : []);
                setCategories(
                    Array.isArray(catData) ? catData : catData?.categories || []
                );
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const parent = useMemo(
        () =>
            categories.find(
                (c) =>
                    !c.parentId &&
                    c.name?.toLowerCase() === PARENT_NAME.toLowerCase()
            ) ||
            categories.find(
                (c) => c.name?.toLowerCase() === PARENT_NAME.toLowerCase()
            ),
        [categories]
    );

    const subcategories = useMemo(
        () =>
            categories.filter((c) => c.parentId === parent?.id),
        [categories, parent]
    );

    const subIds = useMemo(
        () => subcategories.map((c) => c.id),
        [subcategories]
    );

    const filtered = useMemo(() => {
        return listings.filter((listing) => {
            const catId = listing.categoryId ?? listing.category?.id;
            if (!subIds.includes(catId)) return false;
            if (selectedSubId != null && catId !== selectedSubId) return false;
            return true;
        });
    }, [listings, subIds, selectedSubId]);

    const getImage = (listing: any) => {
        const imgs = listing.images || listing.listingimage || [];
        return imgs[0]?.imageUrl || null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f7f7f5] p-10 text-sm text-gray-500">
                Loading equipment...
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#f7f7f5]">
            <section className="bg-[#24272b] px-5 py-14 text-white sm:px-8 lg:px-12">
                <div className="mx-auto max-w-[1440px]">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff9900]">
                        Rosebod Marketplace
                    </p>
                    <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                        Industrial Property
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm text-gray-300 sm:text-base">
                        Warehouses, factories, yards and industrial land..
                    </p>
                </div>
            </section>

            <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12">
                {/* Subcategory chips */}
                <div className="mb-8 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setSelectedSubId(null)}
                        className={`rounded-full px-4 py-2 text-xs font-bold transition ${selectedSubId === null
                            ? "bg-[#ff9900] text-[#24272b]"
                            : "border border-gray-200 bg-white text-gray-700 hover:border-orange-200"
                            }`}
                    >
                        All
                    </button>

                    {subcategories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedSubId(cat.id)}
                            className={`rounded-full px-4 py-2 text-xs font-bold transition ${selectedSubId === cat.id
                                ? "bg-[#ff9900] text-[#24272b]"
                                : "border border-gray-200 bg-white text-gray-700 hover:border-orange-200"
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                <p className="mb-5 text-sm text-gray-500">
                    <span className="font-bold text-[#24272b]">{filtered.length}</span>{" "}
                    listing{filtered.length === 1 ? "" : "s"}
                </p>

                {filtered.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
                        <h2 className="text-xl font-bold text-[#24272b]">
                            No equipment listings yet
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Try another subcategory or check back later.
                        </p>
                        <Link
                            href="/listings"
                            className="mt-6 inline-flex rounded-xl bg-[#ff9900] px-5 py-3 text-sm font-extrabold text-[#24272b]"
                        >
                            Browse all listings
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {filtered.map((listing) => {
                            const image = getImage(listing);

                            return (
                                <Link
                                    key={listing.id}
                                    href={`/listings/${listing.id}`}
                                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-orange-200 hover:shadow-md"
                                >
                                    <div className="h-48 bg-gray-100">
                                        {image ? (
                                            <img
                                                src={image}
                                                alt={listing.title || "Listing"}
                                                className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-sm text-gray-400">
                                                No image
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <p className="text-[11px] font-medium text-gray-500">
                                            {listing.category?.name || "Equipment"}
                                        </p>
                                        <h3 className="mt-1 line-clamp-2 text-base font-bold text-[#24272b]">
                                            {listing.title}
                                        </h3>
                                        <p className="mt-2 text-sm font-extrabold text-[#24272b]">
                                            ₦{Number(listing.price || 0).toLocaleString()}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}