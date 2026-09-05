"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import API_BASE_URL from "@/lib/api-config";

export default function AdminAuctionDetailsPage() {

  const { id } =
    useParams();

  const [
    auction,
    setAuction,
  ] = useState<any>(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {

    const loadAuction =
      async () => {

        try {

          const res =
            await fetch(
              `${API_BASE_URL}/api/auctions/${id}`
            );

          const data =
            await res.json();

          if (!res.ok) {

            throw new Error(
              data.message ||
              "Failed to load auction"
            );

          }

          setAuction(data);

        } catch (error) {

          console.error(
            "Failed to load auction:",
            error
          );

        } finally {

          setLoading(false);

        }

      };

    if (id) {

      loadAuction();

    }

  }, [id]);

  if (loading) {

    return (

      <div className="p-10">

        Loading auction...

      </div>

    );

  }

  if (!auction) {

    return (

      <div className="p-10">

        Auction not found.

      </div>

    );

  }

  return (

    <div className="max-w-6xl mx-auto p-8">

      <div className="mb-8">

        <p className="text-sm text-gray-500">

          Admin Auction Review

        </p>

        <h1 className="text-4xl font-bold mt-2">

          {
            auction.listing?.title
          }

        </h1>

      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Images */}

        <div>

          {auction.listing
            ?.images?.[0] ? (

            <img
              src={
                auction.listing
                  .images[0]
                  .imageUrl
              }
              alt={
                auction.listing
                  ?.title
              }
              className="w-full h-[450px] object-cover rounded-2xl"
            />

          ) : (

            <div className="w-full h-[450px] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">

              No image available

            </div>

          )}

        </div>

        {/* Listing information */}

        <div className="space-y-6">

          <div className="border rounded-xl p-5">

            <p className="text-sm text-gray-500">

              Category

            </p>

            <p className="font-bold">

              {
                auction.listing
                  ?.category?.name ||
                "No category"
              }

            </p>

          </div>

          <div className="border rounded-xl p-5">

            <p className="text-sm text-gray-500">

              Seller

            </p>

            <p className="font-bold">

              {
                auction.listing
                  ?.seller?.name ||
                "Unknown seller"
              }

            </p>

            <p className="text-gray-500">

              {
                auction.listing
                  ?.seller?.email
              }

            </p>

          </div>

          <div className="border rounded-xl p-5">

            <p className="text-sm text-gray-500">

              Description

            </p>

            <p className="mt-2">

              {
                auction.listing
                  ?.description
              }

            </p>

          </div>

        </div>

      </div>

      {/* Auction details */}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">

        <div className="border rounded-xl p-5">

          <p className="text-sm text-gray-500">

            Starting Bid

          </p>

          <p className="text-xl font-bold">

            ₦
            {Number(
              auction.startingBid
            ).toLocaleString()}

          </p>

        </div>

        <div className="border rounded-xl p-5">

          <p className="text-sm text-gray-500">

            Current Bid

          </p>

          <p className="text-xl font-bold">

            ₦
            {Number(
              auction.currentBid
            ).toLocaleString()}

          </p>

        </div>

        <div className="border rounded-xl p-5">

          <p className="text-sm text-gray-500">

            Minimum Increment

          </p>

          <p className="text-xl font-bold">

            ₦
            {Number(
              auction.minimumIncrement
            ).toLocaleString()}

          </p>

        </div>

        <div className="border rounded-xl p-5">

          <p className="text-sm text-gray-500">

            Total Bids

          </p>

          <p className="text-xl font-bold">

            {
              auction.bids
                ?.length || 0
            }

          </p>

        </div>

      </div>

      {/* Dates */}

      <div className="border rounded-xl p-6 mt-8">

        <h2 className="text-2xl font-bold mb-5">

          Auction Schedule

        </h2>

        <p>

          <strong>
            Starts:
          </strong>

          {" "}

          {
            new Date(
              auction.startDate
            ).toLocaleString()
          }

        </p>

        <p className="mt-3">

          <strong>
            Ends:
          </strong>

          {" "}

          {
            new Date(
              auction.endDate
            ).toLocaleString()
          }

        </p>

      </div>

      {/* Approval status */}

      <div className="border rounded-xl p-6 mt-8">

        <h2 className="text-2xl font-bold">

          Approval Status

        </h2>

        <p className="mt-3">

          {
            auction.listing
              ?.isApproved
              ? "This auction listing is approved."
              : "This auction is waiting for admin approval."
          }

        </p>

      </div>

    </div>

  );

}