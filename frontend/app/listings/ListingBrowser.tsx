"use client";

import { useEffect, useState } from "react";
import ListingCard from "@/components/ListingCard";
import API_BASE_URL from "@/lib/api-config";

export default function ListingsBrowser({
  listings,
}: {
  listings: any[];
}) {
  const [showFilters, setShowFilters] =
    useState(false);

  const [showSort, setShowSort] =
    useState(false);

  const [sortBy, setSortBy] =
    useState("newest");

  const [search, setSearch] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [selectedSubcategory, setSelectedSubcategory] =
    useState("");

  const [selectedLocation, setSelectedLocation] =
    useState("");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [selectedCondition, setSelectedCondition] =
    useState("");

  const [minYear, setMinYear] =
    useState("");

  const [maxYear, setMaxYear] =
    useState("");

  const [sellerType, setSellerType] =
    useState("all");

  const [verifiedOnly, setVerifiedOnly] =
    useState(false);

  const [auctionOnly, setAuctionOnly] =
    useState(false);

  const [categories, setCategories] = useState<any[]>([]);



  useEffect(() => {
    fetch(`${API_BASE_URL}/api/categories`)
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  function getParentCategoryName(listing: any) {
    const cat = listing.category;
    if (!cat) return "";

    if (cat.parent?.name) return cat.parent.name;

    if (cat.parentId && categories.length) {
      const parent = categories.find((c) => c.id === cat.parentId);
      return parent?.name || "";
    }

    // top-level category (no parent)
    if (!cat.parentId) return cat.name || "";

    return "";
  }

  function getSubcategoryName(listing: any) {
    const cat = listing.category;
    if (!cat) return "";
    if (cat.parentId) return cat.name || "";
    return "";
  }

  const filteredListings =
    listings.filter((listing) => {

      const parentCategory = getParentCategoryName(listing);
      const subcategory = getSubcategoryName(listing);

      const location =
        [
          listing.equipmentDetails?.state,
          listing.propertyDetails?.state,
          listing.quarryDetails?.state,
          listing.sparepartDetails?.state,
        ]
          .filter(Boolean)
          .join(" ");

      const condition =
        listing.equipmentDetails?.condition ||
        listing.sparepartDetails?.condition ||
        "";

      const year =
        listing.equipmentDetails?.year;

      const seller = listing.seller || listing.user;
      const hasCompany = Boolean(seller?.companyName?.trim());

      const matchesSellerType =
        sellerType === "all" ||
        (sellerType === "private" && !hasCompany) ||
        (sellerType === "dealer" && hasCompany);

      const matchesSearch =
        !search ||
        listing.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        listing.description
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =
        !selectedCategory ||
        parentCategory ===
        selectedCategory;

      const matchesSubcategory =
        !selectedSubcategory ||
        subcategory ===
        selectedSubcategory;

      const matchesLocation =
        !selectedLocation ||
        location
          .toLowerCase()
          .includes(
            selectedLocation
              .toLowerCase()
          );

      const matchesMinPrice =
        !minPrice ||
        Number(listing.price) >=
        Number(minPrice);

      const matchesMaxPrice =
        !maxPrice ||
        Number(listing.price) <=
        Number(maxPrice);

      const matchesCondition =
        !selectedCondition ||
        condition ===
        selectedCondition;

      const matchesMinYear =
        !minYear ||
        Number(year) >=
        Number(minYear);

      const matchesMaxYear =
        !maxYear ||
        Number(year) <=
        Number(maxYear);

      const matchesVerified =
        !verifiedOnly ||
        seller?.isApproved === true;

      const matchesAuction =
        !auctionOnly ||
        listing.isAuction === true;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubcategory &&
        matchesLocation &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesCondition &&
        matchesMinYear &&
        matchesMaxYear &&
        matchesSellerType &&
        matchesVerified &&
        matchesAuction

      );
    });

  const sortedListings =
    [...filteredListings].sort(
      (a, b) => {
        if (
          sortBy === "price-low"
        ) {
          return (
            Number(a.price) -
            Number(b.price)
          );
        }

        if (
          sortBy === "price-high"
        ) {
          return (
            Number(b.price) -
            Number(a.price)
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
      }
    );



  const categoryCounts =
    listings.reduce(
      (
        counts: Record<
          string,
          number
        >,
        listing: any
      ) => {

        const category = getParentCategoryName(listing) || "Other";

        counts[category] =
          (counts[category] || 0) + 1;

        return counts;

      },
      {}
    );

  return (
    <main className="min-h-screen bg-[#f7f7f5]">

      {/* PAGE HEADER */}

      <section className="border-b bg-white">

        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">

          <p className="text-xs text-gray-500">

            Home

            <span className="mx-2">
              /
            </span>

            <span className="font-semibold text-gray-700">
              Browse Listings
            </span>

          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#24272b] sm:text-3xl">

            Browse All Listings

          </h1>

          {/* MOBILE + TABLET BUTTONS */}

          <div className="mt-5 flex gap-3 lg:hidden">

            <button
              type="button"
              onClick={() => {
                setShowFilters(
                  !showFilters
                );

                setShowSort(
                  false
                );
              }}
              className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-[#24272b] shadow-sm"
            >

              <span>
                ⚑
              </span>

              Filters

            </button>

            <button
              type="button"
              onClick={() => {
                setShowSort(
                  !showSort
                );

                setShowFilters(
                  false
                );
              }}
              className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-[#24272b] shadow-sm"
            >

              <span>
                ↕
              </span>

              Sort

            </button>

          </div>


          {/* MOBILE + TABLET FILTER PANEL */}

          {showFilters && (

            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-lg lg:hidden">

              <div className="flex items-center justify-between">

                <h2 className="text-lg font-bold">
                  Filters
                </h2>

                <button
                  type="button"
                  onClick={() => {

                    setSearch("");
                    setSelectedCategory("");
                    setSelectedSubcategory("");
                    setSelectedLocation("");
                    setMinPrice("");
                    setMaxPrice("");
                    setSelectedCondition("");
                    setMinYear("");
                    setMaxYear("");
                    setSellerType("all");
                    setVerifiedOnly(false);
                    setAuctionOnly(false);

                  }}
                  className="text-sm font-semibold text-orange-600"
                >
                  Clear all
                </button>

              </div>

              <div className="mt-5 space-y-6">

                {/* SEARCH */}

                <div>

                  <label className="mb-2 block text-sm font-semibold">
                    Search keyword
                  </label>

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search keyword..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none"
                  />

                </div>

                {/* CATEGORY */}

                <div>

                  <label className="mb-2 block text-sm font-semibold">
                    Category
                  </label>

                  <select
                    value={selectedCategory}
                    onChange={(e) => {

                      setSelectedCategory(
                        e.target.value
                      );

                      setSelectedSubcategory("");

                    }}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none"
                  >

                    <option value="">
                      All Categories
                    </option>

                    <option value="Equipment">
                      Heavy Equipment
                    </option>

                    <option value="Properties">
                      Industrial Property
                    </option>

                    <option value="Quarry">
                      Quarry Assets
                    </option>

                    <option value="Spare Parts">
                      Spare Parts
                    </option>

                  </select>

                </div>

                {/* SUBCATEGORY */}

                <div>

                  <label className="mb-2 block text-sm font-semibold">
                    Subcategory
                  </label>

                  <select
                    value={selectedSubcategory}
                    onChange={(e) =>
                      setSelectedSubcategory(
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none"
                  >

                    <option value="">
                      All Subcategories
                    </option>

                    {Array.from(

                      new Set(

                        listings
                          .filter(
                            (listing: any) =>
                              !selectedCategory ||
                              getParentCategoryName(listing) === selectedCategory)
                          .map(
                            (listing: any) =>
                              listing.category
                                ?.name
                          )
                          .filter(Boolean)

                      )

                    ).map(
                      (subcategory: any) => (

                        <option
                          key={subcategory}
                          value={subcategory}
                        >

                          {subcategory}

                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* LOCATION */}

                <div>

                  <label className="mb-2 block text-sm font-semibold">
                    Location
                  </label>

                  <select
                    value={selectedLocation}
                    onChange={(e) =>
                      setSelectedLocation(
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none"
                  >

                    <option value="">
                      All Locations
                    </option>

                    {Array.from(

                      new Set(

                        listings
                          .flatMap(
                            (listing: any) => [

                              listing
                                .equipmentDetails
                                ?.state,

                              listing
                                .propertyDetails
                                ?.state,

                              listing
                                .quarryDetails
                                ?.state,

                              listing
                                .sparepartDetails
                                ?.state,

                            ]
                          )
                          .filter(Boolean)

                      )

                    ).sort().map(
                      (state: any) => (

                        <option
                          key={state}
                          value={state}
                        >

                          {state}

                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* PRICE */}

                <div>

                  <p className="mb-2 text-sm font-semibold">
                    Price Range
                  </p>

                  <div className="grid grid-cols-2 gap-3">

                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) =>
                        setMinPrice(
                          e.target.value
                        )
                      }
                      placeholder="Min (₦)"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none"
                    />

                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) =>
                        setMaxPrice(
                          e.target.value
                        )
                      }
                      placeholder="Max (₦)"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none"
                    />

                  </div>

                </div>

                {/* CONDITION */}

                <div>

                  <label className="mb-2 block text-sm font-semibold">
                    Condition
                  </label>

                  <select
                    value={selectedCondition}
                    onChange={(e) =>
                      setSelectedCondition(
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none"
                  >

                    <option value="">
                      All Conditions
                    </option>

                    <option value="New">
                      New
                    </option>

                    <option value="Excellent">
                      Excellent
                    </option>

                    <option value="Good">
                      Good
                    </option>

                    <option value="Fair">
                      Fair
                    </option>

                    <option value="Used">
                      Used
                    </option>

                  </select>

                </div>

                {/* YEAR */}

                <div>

                  <p className="mb-2 text-sm font-semibold">
                    Year
                  </p>

                  <div className="grid grid-cols-2 gap-3">

                    <input
                      type="number"
                      value={minYear}
                      onChange={(e) =>
                        setMinYear(
                          e.target.value
                        )
                      }
                      placeholder="From"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none"
                    />

                    <input
                      type="number"
                      value={maxYear}
                      onChange={(e) =>
                        setMaxYear(
                          e.target.value
                        )
                      }
                      placeholder="To"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none"
                    />

                  </div>

                </div>

                {/* SELLER TYPE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold">
                    Seller Type
                  </label>

                  <select
                    value={sellerType}
                    onChange={(e) =>
                      setSellerType(
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none"
                  >

                    <option value="all">
                      All Sellers
                    </option>

                    <option value="private">
                      Private Seller
                    </option>

                    <option value="dealer">
                      Dealer / Company
                    </option>

                  </select>

                </div>

                {/* EXTRA FILTERS */}

                <label className="flex items-center gap-3 text-sm font-medium">

                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) =>
                      setVerifiedOnly(
                        e.target.checked
                      )
                    }
                    className="h-4 w-4"
                  />

                  Verified Sellers Only

                </label>

                <label className="flex items-center gap-3 text-sm font-medium">

                  <input
                    type="checkbox"
                    checked={auctionOnly}
                    onChange={(e) =>
                      setAuctionOnly(
                        e.target.checked
                      )
                    }
                    className="h-4 w-4"
                  />

                  Auction Listings Only

                </label>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowFilters(false)
                }
                className="mt-7 w-full rounded-xl bg-[#ff9900] px-5 py-3 font-bold text-[#24272b]"
              >

                Apply Filters

              </button>

            </div>

          )}


          {/* MOBILE + TABLET SORT PANEL */}

          {showSort && (

            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-lg lg:hidden">

              <div className="flex items-center justify-between">

                <h2 className="text-lg font-bold">

                  Sort Listings

                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setShowSort(
                      false
                    )
                  }
                  className="text-sm font-semibold text-orange-600"
                >

                  Close

                </button>

              </div>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(
                    e.target.value
                  );

                  setShowSort(
                    false
                  );
                }}
                className="mt-5 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none"
              >

                <option value="newest">

                  Newest First

                </option>

                <option value="price-low">

                  Price: Low to High

                </option>

                <option value="price-high">

                  Price: High to Low

                </option>

              </select>

            </div>

          )}

        </div>

      </section>

      {/* MAIN CONTENT */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">

          {/* DESKTOP FILTER SIDEBAR */}

          {/* DESKTOP FILTER SIDEBAR */}

          <aside className="hidden h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:block">

            <div className="flex items-center justify-between">

              <h2 className="font-bold">
                Filters
              </h2>

              <button
                type="button"
                onClick={() => {

                  setSearch("");
                  setSelectedCategory("");
                  setSelectedSubcategory("");
                  setSelectedLocation("");
                  setMinPrice("");
                  setMaxPrice("");
                  setSelectedCondition("");
                  setMinYear("");
                  setMaxYear("");
                  setSellerType("all");
                  setVerifiedOnly(false);
                  setAuctionOnly(false);

                }}
                className="text-xs font-semibold text-orange-600"
              >

                Clear all

              </button>

            </div>

            {/* SEARCH */}

            <div className="mt-5">

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search keyword..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none"
              />

            </div>

            {/* CATEGORY */}

            <div className="mt-6 border-t pt-5">

              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">

                Category

              </p>


              <div className="mt-4 space-y-3 text-sm">

                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === ""}
                    onChange={() => {
                      setSelectedCategory("");
                      setSelectedSubcategory("");
                    }}
                  />
                  All categories
                </label>

                <label className="flex cursor-pointer items-center justify-between gap-2">

                  <span className="flex items-center gap-2">



                    <input
                      type="radio"
                      name="category"
                      checked={
                        selectedCategory ===
                        "Equipment"
                      }
                      onChange={() => {

                        setSelectedCategory(
                          "Equipment"
                        );

                        setSelectedSubcategory(
                          ""
                        );

                      }}
                    />

                    Heavy Equipment

                  </span>

                  <span className="text-xs text-gray-400">

                    {
                      categoryCounts[
                      "Equipment"
                      ] || 0
                    }

                  </span>

                </label>

                <label className="flex cursor-pointer items-center justify-between gap-2">

                  <span className="flex items-center gap-2">

                    <input
                      type="radio"
                      name="category"
                      checked={
                        selectedCategory ===
                        "Properties"
                      }
                      onChange={() => {

                        setSelectedCategory(
                          "Properties"
                        );

                        setSelectedSubcategory(
                          ""
                        );

                      }}
                    />

                    Industrial Property

                  </span>

                  <span className="text-xs text-gray-400">

                    {
                      categoryCounts[
                      "Properties"
                      ] || 0
                    }

                  </span>

                </label>

                <label className="flex cursor-pointer items-center justify-between gap-2">

                  <span className="flex items-center gap-2">

                    <input
                      type="radio"
                      name="category"
                      checked={
                        selectedCategory ===
                        "Quarry"
                      }
                      onChange={() => {

                        setSelectedCategory(
                          "Quarry"
                        );

                        setSelectedSubcategory(
                          ""
                        );

                      }}
                    />

                    Quarry Assets

                  </span>

                  <span className="text-xs text-gray-400">

                    {
                      categoryCounts[
                      "Quarry"
                      ] || 0
                    }

                  </span>

                </label>

                <label className="flex cursor-pointer items-center justify-between gap-2">

                  <span className="flex items-center gap-2">

                    <input
                      type="radio"
                      name="category"
                      checked={
                        selectedCategory ===
                        "Spare Parts"
                      }
                      onChange={() => {

                        setSelectedCategory(
                          "Spare Parts"
                        );

                        setSelectedSubcategory(
                          ""
                        );

                      }}
                    />

                    Spare Parts

                  </span>

                  <span className="text-xs text-gray-400">

                    {
                      categoryCounts[
                      "Spare Parts"
                      ] || 0
                    }

                  </span>

                </label>

              </div>

            </div>

            {/* SUBCATEGORY */}

            <div className="mt-6 border-t pt-5">

              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">

                Subcategory

              </p>

              <div className="mt-4 max-h-56 space-y-3 overflow-y-auto text-sm">

                {Array.from(

                  new Set(

                    listings
                      .filter(
                        (listing: any) =>

                          !selectedCategory ||

                          listing.category
                            ?.parent
                            ?.name ===
                          selectedCategory

                      )
                      .map(
                        (listing: any) =>
                          listing.category
                            ?.name
                      )
                      .filter(Boolean)

                  )

                ).map(
                  (subcategory: any) => (

                    <label
                      key={subcategory}
                      className="flex cursor-pointer items-center gap-2"
                    >

                      <input
                        type="radio"
                        name="subcategory"
                        checked={
                          selectedSubcategory ===
                          subcategory
                        }
                        onChange={() =>
                          setSelectedSubcategory(
                            subcategory
                          )
                        }
                      />

                      {subcategory}

                    </label>

                  )
                )}

              </div>

            </div>

            {/* LOCATION */}

            <div className="mt-6 border-t pt-5">

              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">

                Location

              </p>

              <select
                value={selectedLocation}
                onChange={(e) =>
                  setSelectedLocation(
                    e.target.value
                  )
                }
                className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none"
              >

                <option value="">
                  All Locations
                </option>

                {Array.from(

                  new Set(

                    listings
                      .flatMap(
                        (listing: any) => [

                          listing
                            .equipmentDetails
                            ?.state,

                          listing
                            .propertyDetails
                            ?.state,

                          listing
                            .quarryDetails
                            ?.state,

                          listing
                            .sparepartDetails
                            ?.state,

                        ]
                      )
                      .filter(Boolean)

                  )

                ).sort().map(
                  (state: any) => (

                    <option
                      key={state}
                      value={state}
                    >

                      {state}

                    </option>

                  )
                )}

              </select>

            </div>

            {/* PRICE */}

            <div className="mt-6 border-t pt-5">

              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">

                Price Range

              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">

                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) =>
                    setMinPrice(
                      e.target.value
                    )
                  }
                  placeholder="Min (₦)"
                  className="min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none"
                />

                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(
                      e.target.value
                    )
                  }
                  placeholder="Max (₦)"
                  className="min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none"
                />

              </div>

            </div>

            {/* CONDITION */}

            <div className="mt-6 border-t pt-5">

              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">

                Condition

              </p>

              <select
                value={selectedCondition}
                onChange={(e) =>
                  setSelectedCondition(
                    e.target.value
                  )
                }
                className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none"
              >

                <option value="">
                  All Conditions
                </option>

                <option value="New">
                  New
                </option>

                <option value="Excellent">
                  Excellent
                </option>

                <option value="Good">
                  Good
                </option>

                <option value="Fair">
                  Fair
                </option>

                <option value="Used">
                  Used
                </option>

              </select>

            </div>

            {/* YEAR */}

            <div className="mt-6 border-t pt-5">

              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">

                Year

              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">

                <input
                  type="number"
                  value={minYear}
                  onChange={(e) =>
                    setMinYear(
                      e.target.value
                    )
                  }
                  placeholder="From"
                  className="min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none"
                />

                <input
                  type="number"
                  value={maxYear}
                  onChange={(e) =>
                    setMaxYear(
                      e.target.value
                    )
                  }
                  placeholder="To"
                  className="min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none"
                />

              </div>

            </div>

            {/* SELLER TYPE */}

            <div className="mt-6 border-t pt-5">

              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">

                Seller Type

              </p>

              <select
                value={sellerType}
                onChange={(e) =>
                  setSellerType(
                    e.target.value
                  )
                }
                className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none"
              >

                <option value="all">
                  All Sellers
                </option>

                <option value="private">
                  Private Seller
                </option>

                <option value="dealer">
                  Dealer / Company
                </option>

              </select>

            </div>

            {/* EXTRA OPTIONS */}

            <div className="mt-6 space-y-4 border-t pt-5">

              <label className="flex cursor-pointer items-center gap-3 text-sm">

                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) =>
                    setVerifiedOnly(
                      e.target.checked
                    )
                  }
                />

                Verified Sellers Only

              </label>

              <label className="flex cursor-pointer items-center gap-3 text-sm">

                <input
                  type="checkbox"
                  checked={auctionOnly}
                  onChange={(e) =>
                    setAuctionOnly(
                      e.target.checked
                    )
                  }
                />

                Auction Listings Only

              </label>

            </div>

            <button
              type="button"
              className="mt-7 w-full rounded-xl bg-[#ff9900] px-4 py-3 text-sm font-bold text-[#24272b]"
            >

              Apply Filters

            </button>

          </aside>

          {/* LISTINGS */}

          <div>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-sm text-gray-600">

                <span className="font-bold text-[#24272b]">

                  {
                    sortedListings.length
                  }

                </span>

                {" "}listings found

              </p>

              {/* DESKTOP SORT */}

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value
                  )
                }
                className="hidden rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none lg:block"
              >

                <option value="newest">

                  Sort: Newest First

                </option>

                <option value="price-low">

                  Price: Low to High

                </option>

                <option value="price-high">

                  Price: High to Low

                </option>

              </select>

            </div>

            {/* RESPONSIVE GRID */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

              {sortedListings.map(
                (
                  listing: any
                ) => (

                  <ListingCard
                    key={
                      listing.id
                    }
                    listing={
                      listing
                    }
                  />

                )
              )}

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}