"use client";

import HeroCarousel from "@/components/HeroCarousel";
import { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/api-config";
import Link from "next/link";
import ListingSection from "@/components/ListingSection";

export default function HomePage() {

    const [listings, setListings] = useState<any[]>([]);

    const [categories, setCategories] = useState<any[]>([]);

    const [stats, setStats] = useState({ listings: 0, sellers: 0, auctions: 0, categories: 0, });
    const [selectedState, setSelectedState] = useState("");
    const [search, setSearch] = useState("");

    const [selectedCategory, setSelectedCategory] =
        useState("");

    const [sort, setSort] = useState("");

    

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const res = await fetch(
                    `${API_BASE_URL}/api/listings`
                );

                const data = await res.json();

                setListings(
                    Array.isArray(data)
                        ? data
                        : []
                );
            } catch (error) {
                console.error(
                    "Failed to fetch listings:",
                    error
                );
            }
        };

        fetchListings();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(
                    `${API_BASE_URL}/api/categories`
                );

                const data = await res.json();

                setCategories(
                    Array.isArray(data)
                        ? data
                        : []
                );
            } catch (error) {
                console.error(
                    "Failed to fetch categories:",
                    error
                );
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(
                    `${API_BASE_URL}/api/home/stats`
                );

                const data = await res.json();

                setStats(data);
            } catch (error) {
                console.error(
                    "Failed to fetch homepage stats:",
                    error
                );
            }
        };

        fetchStats();
    }, []);

    const getListingsByParent =
        (parentName: string) => {

            const parent =
                categories.find(
                    (category: any) =>
                        category.name ===
                        parentName
                );

            if (!parent) {
                return [];
            }

            const subCategoryIds =
                categories
                    .filter(
                        (category: any) =>
                            category.parentId ===
                            parent.id
                    )
                    .map(
                        (category: any) =>
                            category.id
                    );

            return listings.filter(
                (listing: any) =>
                    subCategoryIds.includes(
                        listing.categoryId
                    )
            );
        };

    const featuredEquipment =
        getListingsByParent(
            "Equipment"
        );

    const featuredProperties =
        getListingsByParent(
            "Properties"
        );

    const featuredQuarries =
        getListingsByParent(
            "Quarry"
        );

    const featuredSpareParts =
        getListingsByParent(
            "Spare Parts"
        );

    const now = new Date();

    const featuredAuctions =
        listings.filter(
            (listing: any) =>
                listing.isAuction &&
                listing.auction &&
                !listing.isSold &&
                listing.auction.endDate &&
                new Date(
                    listing.auction.endDate
                ) > now
        );

    const filteredListings = listings
        .filter((listing: any) => {

            const searchText =
                search.toLowerCase();

            const matchesSearch =
                !search ||
                listing.title
                    ?.toLowerCase()
                    .includes(searchText) ||
                listing.description
                    ?.toLowerCase()
                    .includes(searchText) ||
                listing.category
                    ?.name
                    ?.toLowerCase()
                    .includes(searchText);

            const matchesCategory =
                !selectedCategory ||
                listing.categoryId ===
                Number(selectedCategory) ||
                listing.category?.parentId ===
                Number(selectedCategory);

            const listingState =
                listing.equipmentDetails?.state ||
                listing.propertyDetails?.state ||
                listing.quarryDetails?.state ||
                listing.sparePartDetails?.state ||
                "";

            const matchesState =
                !selectedState ||
                listingState
                    .toLowerCase()
                    .trim() ===
                selectedState
                    .toLowerCase()
                    .trim();

            return (
                matchesSearch &&
                matchesCategory &&
                matchesState
            );
        })
        .sort((a: any, b: any) => {

            if (sort === "priceAsc") {
                return (
                    Number(a.price) -
                    Number(b.price)
                );
            }

            if (sort === "priceDesc") {
                return (
                    Number(b.price) -
                    Number(a.price)
                );
            }

            if (sort === "oldest") {
                return (
                    new Date(
                        a.createdAt
                    ).getTime() -
                    new Date(
                        b.createdAt
                    ).getTime()
                );
            }

            return (
                new Date(
                    b.createdAt
                ).getTime() -
                new Date(
                    a.createdAt
                ).getTime()
            );
        });
    const parentCategories =
        categories.filter(
            (category: any) =>
                !category.parentId
        );

    const latestListings =
        filteredListings.slice(0, 6);

    return (
        <main className="bg-slate-50">

            {/* HERO */}

            <section className="px-4 pt-4 md:px-8 lg:px-12">
                <HeroCarousel
                    search={search}
                    setSearch={setSearch}

                    selectedCategory={
                        selectedCategory
                    }
                    setSelectedCategory={
                        setSelectedCategory
                    }

                    selectedState={
                        selectedState
                    }
                    setSelectedState={
                        setSelectedState
                    }

                    categories={
                        parentCategories
                    }

                    resultCount={
                        filteredListings.length
                    }

                    onSearch={() => {

                        document
                            .getElementById(
                                "latest-listings"
                            )
                            ?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            });

                    }}
                />
            </section>


            {/* STATS */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 -mt-8 relative z-20">

                    <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
                        <div className="text-2xl mb-2">🛡️</div>

                        <p className="font-bold text-gray-900">
                            Verified Sellers
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                            Trusted marketplace profiles
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
                        <div className="text-2xl mb-2">🏗️</div>

                        <p className="font-bold text-gray-900">
                            Industrial Assets
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                            Equipment, property and quarry
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
                        <div className="text-2xl mb-2">🔨</div>

                        <p className="font-bold text-gray-900">
                            Secure Auctions
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                            Bid on valuable assets
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
                        <div className="text-2xl mb-2">🇳🇬</div>

                        <p className="font-bold text-gray-900">
                            Built for Nigeria
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                            Find assets across the country
                        </p>
                    </div>

                </div>
            </section>


            {/* CATEGORIES */}

            <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-20">

                <div className="max-w-2xl mb-10">

                    <p className="text-orange-600 font-semibold">
                        EXPLORE ROSEBOD
                    </p>

                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
                        Find the right industrial asset
                    </h2>

                    <p className="text-gray-500 mt-4">
                        Browse equipment, properties,
                        quarry opportunities, spare parts
                        and live auctions across Nigeria.
                    </p>

                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">

                    <Link
                        href="/equipment"
                        className="group"
                    >
                        <div className="h-full bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition">

                            <img
                                src="/homepage/heavy-equipments.jfif"
                                alt="Heavy equipment"
                                className="h-40 w-full object-cover group-hover:scale-105 transition duration-500"
                            />

                            <div className="p-5">

                                <h3 className="font-bold text-lg">
                                    Equipment
                                </h3>

                                <p className="text-sm text-gray-500 mt-2">
                                    Machines and industrial assets
                                </p>

                            </div>

                        </div>
                    </Link>


                    <Link
                        href="/properties"
                        className="group"
                    >
                        <div className="h-full bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition">

                            <img
                                src="/homepage/pp.jfif"
                                alt="Industrial properties"
                                className="h-40 w-full object-cover group-hover:scale-105 transition duration-500"
                            />

                            <div className="p-5">

                                <h3 className="font-bold text-lg">
                                    Properties
                                </h3>

                                <p className="text-sm text-gray-500 mt-2">
                                    Land, warehouses and factories
                                </p>

                            </div>

                        </div>
                    </Link>


                    <Link
                        href="/quarry"
                        className="group"
                    >
                        <div className="h-full bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition">

                            <img
                                src="/homepage/Quuarry-asset.jfif"
                                alt="Quarry assets"
                                className="h-40 w-full object-cover group-hover:scale-105 transition duration-500"
                            />

                            <div className="p-5">

                                <h3 className="font-bold text-lg">
                                    Quarry
                                </h3>

                                <p className="text-sm text-gray-500 mt-2">
                                    Quarry and mining opportunities
                                </p>

                            </div>

                        </div>
                    </Link>


                    <Link
                        href="/spare-parts"
                        className="group"
                    >
                        <div className="h-full bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition">

                            <img
                                src="/homepage/sspareparts.jfif"
                                alt="Spare parts"
                                className="h-40 w-full object-cover group-hover:scale-105 transition duration-500"
                            />

                            <div className="p-5">

                                <h3 className="font-bold text-lg">
                                    Spare Parts
                                </h3>

                                <p className="text-sm text-gray-500 mt-2">
                                    Parts for industrial machinery
                                </p>

                            </div>

                        </div>
                    </Link>


                    <Link
                        href="/auctions"
                        className="group"
                    >
                        <div className="h-full bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition">

                            <img
                                src="/homepage/auction.jfif"
                                alt="Live auctions"
                                className="h-40 w-full object-cover group-hover:scale-105 transition duration-500"
                            />

                            <div className="p-5">

                                <h3 className="font-bold text-lg">
                                    Auctions
                                </h3>

                                <p className="text-sm text-gray-500 mt-2">
                                    Bid on verified industrial assets
                                </p>

                            </div>

                        </div>
                    </Link>

                </div>

            </section>



            {/* LATEST */}
            <div id="latest-listings">
                <ListingSection
                    title="Latest Listings"
                    subtitle="Recently added industrial assets on Rosebod."
                    link="/listings"
                    listings={latestListings}
                    limit={6}
                />
            </div>

            {/* FEATURED EQUIPMENT */}

            {featuredEquipment.length > 0 && (

                <ListingSection
                    title="Featured Equipment"
                    subtitle="Explore machinery available from sellers across Nigeria."
                    link="/equipment"
                    listings={featuredEquipment}
                    limit={4}

                />

            )}


            {/* FEATURED PROPERTIES */}

            {featuredProperties.length > 0 && (

                <ListingSection
                    title="Industrial Properties"
                    subtitle="Land, warehouses, factories and commercial opportunities."
                    link="/properties"
                    listings={featuredProperties}
                    limit={4}
                />

            )}


            {/* FEATURED QUARRY */}

            {featuredQuarries.length > 0 && (

                <ListingSection
                    title="Quarry Opportunities"
                    subtitle="Discover quarry assets, mining opportunities and partnerships."
                    link="/quarry"
                    listings={featuredQuarries}
                    limit={4}
                />

            )}


            {/* SPARE PARTS */}

            {featuredSpareParts.length > 0 && (

                <ListingSection
                    title="Featured Spare Parts"
                    subtitle="Find replacement parts for industrial equipment."
                    link="/spare-parts"
                    listings={featuredSpareParts}
                    limit={4}
                />

            )}


            {/* LIVE AUCTIONS */}

            {featuredAuctions.length > 0 && (

                <ListingSection
                    title="Live Auctions"
                    subtitle="Bid on industrial assets before the auction closes."
                    link="/auctions"
                    listings={featuredAuctions}
                    limit={4}
                />

            )}




            {/* TRUST */}

            {/* <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-20">

                <div className="bg-slate-900 rounded-3xl p-8 md:p-14 text-white">

                    <div className="max-w-2xl">

                        <p className="text-orange-400 font-semibold">
                            WHY ROSEBOD
                        </p>

                        <h2 className="text-3xl md:text-4xl font-bold mt-3">
                            A better way to trade industrial assets
                        </h2>

                        <p className="text-slate-300 mt-4">
                            Rosebod connects buyers and sellers
                            of equipment, industrial properties,
                            quarry assets and spare parts across Nigeria.
                        </p>

                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mt-12">

                        <div>

                            <h3 className="font-bold text-xl">
                                ✓ Verified Sellers
                            </h3>

                            <p className="text-slate-400 mt-3">
                                Seller verification helps buyers
                                make more informed decisions.
                            </p>

                        </div>

                        <div>

                            <h3 className="font-bold text-xl">
                                ✓ Nationwide Reach
                            </h3>

                            <p className="text-slate-400 mt-3">
                                Discover industrial opportunities
                                across Nigeria.
                            </p>

                        </div>

                        <div>

                            <h3 className="font-bold text-xl">
                                ✓ Live Auctions
                            </h3>

                            <p className="text-slate-400 mt-3">
                                Participate in transparent,
                                time-based bidding.
                            </p>

                        </div>

                    </div>

                </div>

            </section> */}

            <section className="my-20 rounded-3xl bg-slate-950 px-6 py-14 text-white md:px-12">
                <div className="mx-auto max-w-3xl text-center">

                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
                        Why Rosebod
                    </p>

                    <h2 className="text-3xl font-bold md:text-4xl">
                        Built for Serious Industrial Transactions
                    </h2>

                    <p className="mt-4 text-slate-300">
                        Discover equipment, industrial properties,
                        quarry opportunities and spare parts in one
                        professional marketplace.
                    </p>

                </div>

                <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <div className="mb-4 text-3xl">
                            ✓
                        </div>

                        <h3 className="text-lg font-bold">
                            Verified Sellers
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-300">
                            Seller accounts are reviewed before
                            they can publish listings.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <div className="mb-4 text-3xl">
                            📋
                        </div>

                        <h3 className="text-lg font-bold">
                            Detailed Listings
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-300">
                            Review specifications, condition,
                            pricing, location and seller details.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <div className="mb-4 text-3xl">
                            💬
                        </div>

                        <h3 className="text-lg font-bold">
                            Contact Sellers Directly
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-300">
                            Connect with sellers through WhatsApp
                            or email from the listing page.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <div className="mb-4 text-3xl">
                            🏗️
                        </div>

                        <h3 className="text-lg font-bold">
                            Industrial Marketplace
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-300">
                            Equipment, properties, quarry assets
                            and spare parts in one place.
                        </p>
                    </div>

                </div>
            </section>

        </main>
    );
}