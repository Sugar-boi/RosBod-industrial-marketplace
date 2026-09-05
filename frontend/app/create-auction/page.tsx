"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import API_BASE_URL from "@/lib/api-config";

import AuctionSettings from "./components/AuctionSettings";
import InspectionInformation from "./components/InspectionInformation";
import AuctionTerms from "./components/AuctionTerms";

import BasicInformation from "../create-listing/components/BasicInformation";
import ImageUploader from "../create-listing/components/ImageUploader";
import AuctionModeSelector from "./components/AuctionModeSelector";
import ExistingListingSelector from "./components/ExistingListingSelector";
import { apiFetch } from "@/lib/api-fetch";

export default function CreateAuctionPage() {
  const router = useRouter();
  const DRAFT_KEY = "create-auction-draft";
  // Auction mode
  const [auctionMode, setAuctionMode] =
    useState<"existing" | "new">("existing");
  // New listing details
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [price, setPrice] = useState("");
  const [imageUrls, setImageUrls] =
    useState<string[]>([]);
  const [categoryId, setCategoryId] =
    useState("");
  const [parentCategoryId,
    setParentCategoryId,
  ] = useState("");

  // Existing listings

  const [listings, setListings] =
    useState<any[]>([]);

  const [listingId, setListingId] =
    useState("");






  const [categories, setCategories] =
    useState<any[]>([]);

  // Auction settings

  const [startingBid, setStartingBid] =
    useState("");

  const [reservePrice, setReservePrice] =
    useState("");

  const [buyNowPrice, setBuyNowPrice] =
    useState("");

  const [
    minimumIncrement,
    setMinimumIncrement,
  ] = useState("");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  // Inspection

  const [
    inspectionState,
    setInspectionState,
  ] = useState("");

  const [
    inspectionCity,
    setInspectionCity,
  ] = useState("");

  const [
    inspectionAddress,
    setInspectionAddress,
  ] = useState("");

  const [
    inspectionDate,
    setInspectionDate,
  ] = useState("");

  // Terms

  const [
    paymentTerms,
    setPaymentTerms,
  ] = useState("");

  const [terms, setTerms] =
    useState("");

  // Loading

  const [loading, setLoading] =
    useState(false);
  const [user, setUser] = useState<any>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw || raw === "undefined") return;
    try {
      setUser(JSON.parse(raw));
    } catch {
      setUser(null);
    }
  }, []);
  // Load seller's listings

  useEffect(() => {
    const loadListings = async () => {
      try {

        const res = await apiFetch(
          "/api/listings/my-listings"
        );

        const data =
          await res.json();


        if (!res.ok) {
          throw new Error(
            data.message ||
            "Failed to load listings"
          );
        }

        if (!Array.isArray(data)) {
          setListings([]);
          return;
        }

        const availableListings =
          data.filter(
            (listing: any) =>
              listing.isApproved === true &&
              listing.isAuction !== true
          );

        setListings(
          availableListings
        );


      } catch (error) {
        console.error(
          "Failed to load listings:",
          error
        );

        setListings([]);
      }
    };

    loadListings();
  }, []);

  // Load categories

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/categories`
        );

        const data =
          await res.json();

        if (!res.ok) {
          throw new Error(
            data.message ||
            "Failed to load categories"
          );
        }

        if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (error) {
        console.error(
          "Failed to load categories:",
          error
        );
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const savedDraft =
      localStorage.getItem(DRAFT_KEY);

    if (!savedDraft) {
      return;
    }

    try {
      const draft =
        JSON.parse(savedDraft);

      if (draft.auctionMode) {
        setAuctionMode(
          draft.auctionMode
        );
      }

      setTitle(draft.title || "");
      setDescription(
        draft.description || ""
      );
      setPrice(draft.price || "");

      setImageUrls(
        Array.isArray(draft.imageUrls)
          ? draft.imageUrls
          : []
      );

      setCategoryId(
        draft.categoryId || ""
      );

      setParentCategoryId(
        draft.parentCategoryId || ""
      );

      setListingId(
        draft.listingId || ""
      );

      setStartingBid(
        draft.startingBid || ""
      );

      setReservePrice(
        draft.reservePrice || ""
      );

      setBuyNowPrice(
        draft.buyNowPrice || ""
      );

      setMinimumIncrement(
        draft.minimumIncrement || ""
      );

      setStartDate(
        draft.startDate || ""
      );

      setEndDate(
        draft.endDate || ""
      );

      setInspectionState(
        draft.inspectionState || ""
      );

      setInspectionCity(
        draft.inspectionCity || ""
      );

      setInspectionAddress(
        draft.inspectionAddress || ""
      );

      setInspectionDate(
        draft.inspectionDate || ""
      );

      setPaymentTerms(
        draft.paymentTerms || ""
      );

      setTerms(
        draft.terms || ""
      );

      console.log(
        "Draft restored successfully"
      );

    } catch (error) {
      console.error(
        "Failed to restore auction draft:",
        error
      );

      localStorage.removeItem(
        DRAFT_KEY
      );
    }
  }, []);

  // Create auction

  const saveDraft = () => {
    try {
      const draft = {
        auctionMode,

        // Existing listing
        listingId,

        // New listing
        title,
        description,
        price,
        imageUrls,
        categoryId,
        parentCategoryId,

        // Auction settings
        startingBid,
        reservePrice,
        buyNowPrice,
        minimumIncrement,
        startDate,
        endDate,

        // Inspection
        inspectionState,
        inspectionCity,
        inspectionAddress,
        inspectionDate,

        // Terms
        paymentTerms,
        terms,

        savedAt:
          new Date().toISOString(),
      };

      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify(draft)
      );

      alert(
        "Your auction has been saved as a draft."
      );

      router.push("/dashboard");

    } catch (error) {
      console.error(
        "Failed to save auction draft:",
        error
      );

      alert(
        "Unable to save your draft. Please try again."
      );
    }
  };

  const handleSubmit = async () => {

    setFormError(null);

    if (user?.role === "SELLER" && user?.isApproved === false) {
      setFormError(
        "Your seller account is still pending approval. You can't create listings yet."
      );
      return; // stop — do not call the API
    }
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        return alert(
          "Please log in again."
        );
      }

      // Existing listing validation

      if (
        auctionMode === "existing" &&
        !listingId
      ) {
        return alert(
          "Please select a listing."
        );
      }

      // New listing validation

      if (auctionMode === "new") {
        if (
          !title ||
          !description ||
          !price ||
          !categoryId
        ) {
          return alert(
            "Please complete all new listing details."
          );
        }

        if (
          imageUrls.length === 0
        ) {
          return alert(
            "Please upload at least one image."
          );
        }
      }

      // Auction validation

      if (!startingBid) {
        return alert(
          "Enter a starting bid."
        );
      }

      if (!minimumIncrement) {
        return alert(
          "Enter the minimum increment."
        );
      }

      if (
        !startDate ||
        !endDate
      ) {
        return alert(
          "Please select auction dates."
        );
      }

      const now = new Date();

      const selectedStartDate =
        new Date(startDate);

      const selectedEndDate =
        new Date(endDate);

      if (
        selectedStartDate <= now
      ) {
        return alert(
          "The auction start date must be in the future."
        );
      }

      if (
        selectedEndDate <=
        selectedStartDate
      ) {
        return alert(
          "The end date must be after the start date."
        );
      }

      setLoading(true);

      const res = await apiFetch(
        "/api/auctions",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            auctionMode,

            // Existing listing

            listingId:
              auctionMode === "existing"
                ? Number(listingId)
                : null,

            // New listing

            title:
              auctionMode === "new"
                ? title
                : null,

            description:
              auctionMode === "new"
                ? description
                : null,

            price:
              auctionMode === "new"
                ? Number(price)
                : null,

            categoryId:
              auctionMode === "new"
                ? Number(categoryId)
                : null,

            images:
              auctionMode === "new"
                ? imageUrls
                : [],

            // Auction

            startingBid:
              Number(startingBid),

            reservePrice:
              reservePrice
                ? Number(reservePrice)
                : null,

            buyNowPrice:
              buyNowPrice
                ? Number(buyNowPrice)
                : null,

            minimumIncrement:
              Number(
                minimumIncrement
              ),

            startDate,

            endDate,

            // Inspection

            inspectionState,

            inspectionCity,

            inspectionAddress,

            inspectionDate,

            // Terms

            paymentTerms,

            terms,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
          "Failed to create auction"
        );
      }

      localStorage.removeItem(
        DRAFT_KEY
      );

      alert(
        auctionMode === "new"
          ? "Auction submitted for admin approval!"
          : "Auction created successfully!"
      );

      window.location.href =
        "/dashboard";

    } catch (err: any) {
      alert(
        err.message ||
        "Failed to create auction"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <div>
        <h1 className="text-4xl font-bold">
          Create Auction
        </h1>

        <p className="text-gray-500 mt-2">
          Create a timed auction for heavy equipment,
          quarry assets or industrial property.
        </p>
      </div>
      {user?.role === "SELLER" && user?.isApproved === false && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Your seller account is pending approval. You can&apos;t create an auction
          until an admin approves you.
        </div>
      )}
      {formError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      )}

      {/* Auction mode */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-2xl font-bold mb-5">
          Auction Listing
        </h2>

        <AuctionModeSelector
          auctionMode={auctionMode}
          setAuctionMode={setAuctionMode}
        />


        {/* Existing listing */}

        {auctionMode === "existing" && (
          <ExistingListingSelector
            listings={listings}
            listingId={listingId}
            setListingId={setListingId}
          />
        )}

        {/* New listing */}

        {auctionMode === "new" && (

          <div className="space-y-8">

            <p className="text-gray-600">
              Create a new auction listing from
              scratch. It will be submitted to an
              administrator for approval before
              becoming public.
            </p>

            {/* Category */}

            <div className="grid md:grid-cols-2 gap-5">

              {/* Main Category */}

              <div>

                <label className="block font-semibold mb-2">
                  Main Category
                </label>

                <select
                  value={parentCategoryId}
                  onChange={(e) => {

                    setParentCategoryId(
                      e.target.value
                    );

                    // Reset the subcategory whenever
                    // the main category changes

                    setCategoryId("");

                  }}
                  className="border p-3 rounded-lg w-full"
                >

                  <option value="">
                    Select main category
                  </option>

                  {categories
                    .filter(
                      (category: any) =>
                        category.parentId === null
                    )
                    .map(
                      (category: any) => (

                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>

                      )
                    )}

                </select>

              </div>

              {/* Subcategory */}

              <div>

                <label className="block font-semibold mb-2">
                  Subcategory
                </label>

                <select
                  value={categoryId}
                  onChange={(e) =>
                    setCategoryId(
                      e.target.value
                    )
                  }
                  disabled={!parentCategoryId}
                  className="border p-3 rounded-lg w-full disabled:bg-gray-100 disabled:text-gray-400"
                >

                  <option value="">
                    {!parentCategoryId
                      ? "Select a main category first"
                      : "Select subcategory"}
                  </option>

                  {categories
                    .filter(
                      (category: any) =>
                        String(
                          category.parentId
                        ) ===
                        parentCategoryId
                    )
                    .map(
                      (category: any) => (

                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>

                      )
                    )}

                </select>

              </div>

            </div>

            {/* Basic information */}

            <BasicInformation
              title={title}
              setTitle={setTitle}

              description={
                description
              }
              setDescription={
                setDescription
              }

              price={price}
              setPrice={setPrice}
            />

            {/* Images */}

            <div>

              <h2 className="text-2xl font-bold mb-5">
                Auction Images
              </h2>

              <ImageUploader
                imageUrls={
                  imageUrls
                }
                setImageUrls={
                  setImageUrls
                }
              />

            </div>

          </div>

        )}

      </div>

      {/* Auction settings */}

      <AuctionSettings

        startingBid={
          startingBid
        }
        setStartingBid={
          setStartingBid
        }

        reservePrice={
          reservePrice
        }
        setReservePrice={
          setReservePrice
        }

        buyNowPrice={
          buyNowPrice
        }
        setBuyNowPrice={
          setBuyNowPrice
        }

        minimumIncrement={
          minimumIncrement
        }
        setMinimumIncrement={
          setMinimumIncrement
        }

        startDate={
          startDate
        }
        setStartDate={
          setStartDate
        }

        endDate={
          endDate
        }
        setEndDate={
          setEndDate
        }

      />

      {/* Inspection */}

      <InspectionInformation

        inspectionState={
          inspectionState
        }
        setInspectionState={
          setInspectionState
        }

        inspectionCity={
          inspectionCity
        }
        setInspectionCity={
          setInspectionCity
        }

        inspectionAddress={
          inspectionAddress
        }
        setInspectionAddress={
          setInspectionAddress
        }

        inspectionDate={
          inspectionDate
        }
        setInspectionDate={
          setInspectionDate
        }

      />

      {/* Terms */}

      <AuctionTerms

        paymentTerms={
          paymentTerms
        }
        setPaymentTerms={
          setPaymentTerms
        }

        terms={terms}
        setTerms={setTerms}

      />

      {/* Submit */}

      <div className="border-t pt-6">

        {/* Administrator approval notice */}

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 mb-6">

          <div className="flex gap-3">

            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
              i
            </div>

            <div>

              <h3 className="font-semibold text-gray-900">
                Administrator Approval Required
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                New auction listings require
                administrator approval before they
                become publicly visible. This process
                typically takes 24–48 hours. You will
                be notified when your auction is
                approved or if any changes are needed.
              </p>

            </div>

          </div>

        </div>

        {/* Bottom actions */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">

          {/* Back */}

          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Back
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">

            {/* Save draft */}

            <button
              type="button"
              onClick={saveDraft}
              disabled={loading}
              className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Save as Draft
            </button>

            {/* Review & Submit */}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-auto rounded-lg bg-orange-500 px-7 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
            >
              {loading
                ? "Submitting..."
                : "Review & Submit"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}