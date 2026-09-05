"use client";

import Link from "next/link";

export default function CreatePage() {
  return (
    <div className="max-w-5xl mx-auto py-20">

      <h1 className="text-4xl font-bold text-center mb-12">
        Choose Selling Method
      </h1>

      <div className="grid md:grid-cols-2 gap-8">

        <div className="border rounded-xl p-8 shadow">

          <h2 className="text-3xl font-bold mb-4">
            📦 Marketplace
          </h2>

          <p className="mb-6 text-gray-600">
            Sell your equipment,
            property,
            quarry,
            or spare parts
            at a fixed price.
          </p>

          <Link
            href="/create-listing"
            className="bg-black text-white px-6 py-3 rounded-lg inline-block"
          >
            Create Listing
          </Link>

        </div>

        <div className="border rounded-xl p-8 shadow">

          <h2 className="text-3xl font-bold mb-4">
            🔨 Auction
          </h2>

          <p className="mb-6 text-gray-600">
            Allow buyers to bid
            until the auction ends.
          </p>

          <Link
            href="/create-auction"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg inline-block"
          >
            Create Auction
          </Link>

        </div>

      </div>

    </div>
  );
}