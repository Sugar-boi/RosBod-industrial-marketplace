"use client";

interface Props {
  listings: any[];
  listingId: string;
  setListingId: (id: string) => void;
}

export default function ExistingListingSelector({
  listings,
  listingId,
  setListingId,
}: Props) {
  return (
    <div>
      {/* HEADER */}

      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-900">
          Select a Listing
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          Choose one of your approved listings eligible for auction.
        </p>
      </div>

      {/* NO LISTINGS */}

      {listings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5 text-center">
          <p className="text-sm font-medium text-gray-700">
            No approved listings available.
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Create and get a listing approved before putting it up for
            auction.
          </p>
        </div>
      ) : (
        /* LISTINGS */

        <div className="max-h-[260px] overflow-y-auto space-y-2 pr-1">
          {listings.map((listing: any) => {
            const selected =
              String(listing.id) === String(listingId);

            const image =
              listing.images?.[0]?.imageUrl ||
              listing.images?.[0] ||
              "/placeholder.jpg";

            return (
              <button
                key={listing.id}
                type="button"
                onClick={() =>
                  setListingId(String(listing.id))
                }
                className={`
                  group
                  w-full
                  rounded-lg
                  border
                  p-2
                  text-left
                  transition
                  ${selected
                    ? "border-orange-400 bg-orange-50"
                    : "border-gray-200 bg-white hover:border-orange-300 hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {/* IMAGE */}

                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-100">
                    <img
                      src={image}
                      alt={listing.title || "Listing"}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* LISTING INFORMATION */}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="truncate text-xs font-semibold text-gray-900">
                        {listing.title}
                      </h3>

                      {selected && (
                        <span className="shrink-0 text-[10px] font-semibold text-orange-600">
                          Selected
                        </span>
                      )}
                    </div>

                    <p className="mt-0.5 truncate text-[10px] text-gray-500">
                      {listing.category?.name || "Equipment"}
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] text-gray-400">
                        Value
                      </span>

                      <span className="text-[10px] font-semibold text-gray-800">
                        ₦
                        {Number(
                          listing.price || 0
                        ).toLocaleString()}
                      </span>

                      {/* APPROVED */}

                      <span className="rounded bg-green-50 px-1.5 py-0.5 text-[9px] font-semibold text-green-600">
                        Approved
                      </span>
                    </div>
                  </div>

                  {/* SELECT BUTTON */}

                  <span
                    className={`
                      shrink-0
                      rounded-md
                      border
                      px-2
                      py-1
                      text-[10px]
                      font-semibold
                      transition
                      ${selected
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-gray-300 bg-white text-gray-700 group-hover:border-orange-400 group-hover:text-orange-600"
                      }
                    `}
                  >
                    {selected ? "Selected ✓" : "Select"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}