"use client";

interface Props {
  auctionMode: "existing" | "new";
  setAuctionMode: (
    mode: "existing" | "new"
  ) => void;
}

export default function AuctionModeSelector({
  auctionMode,
  setAuctionMode,
}: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">

      <h2 className="text-lg font-semibold text-gray-900 mb-5">
        How would you like to proceed?
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        <button
          type="button"
          onClick={() => setAuctionMode("existing")}
          className={`rounded-xl border p-5 text-left transition-all

                    ${auctionMode === "existing"
              ? "border-orange-500 bg-orange-50"
              : "border-gray-200 hover:border-orange-300"
            }`}
        >
          <div className="text-3xl mb-3">
            📋
          </div>

          <h3 className="font-semibold text-gray-900">
            Use Existing Listing
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            Select from your approved listings.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setAuctionMode("new")}
          className={`rounded-xl border p-5 text-left transition-all

                    ${auctionMode === "new"
              ? "border-orange-500 bg-orange-50"
              : "border-gray-200 hover:border-orange-300"
            }`}
        >
          <div className="text-3xl mb-3">
            ➕
          </div>

          <h3 className="font-semibold text-gray-900">
            Create New Auction
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            Create a brand new auction listing.
          </p>
        </button>

      </div>

    </div>
  );
}