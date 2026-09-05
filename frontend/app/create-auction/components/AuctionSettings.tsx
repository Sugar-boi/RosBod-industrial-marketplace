"use client";

type Props = {
  startingBid: string;
  setStartingBid: (value: string) => void;

  reservePrice: string;
  setReservePrice: (value: string) => void;

  buyNowPrice: string;
  setBuyNowPrice: (value: string) => void;

  minimumIncrement: string;
  setMinimumIncrement: (value: string) => void;

  startDate: string;
  setStartDate: (value: string) => void;

  endDate: string;
  setEndDate: (value: string) => void;
};

export default function AuctionSettings({
  startingBid,
  setStartingBid,

  reservePrice,
  setReservePrice,

  buyNowPrice,
  setBuyNowPrice,

  minimumIncrement,
  setMinimumIncrement,

  startDate,
  setStartDate,

  endDate,
  setEndDate,
}: Props) {

  // Gets the current date and time
  // in the format required by datetime-local
  const now = new Date();

  const minimumDateTime = new Date(
    now.getTime() -
    now.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16);

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">

      <h2 className="text-2xl font-bold">
        Auction Settings
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        {/* Starting Bid */}

        <div>
          <label className="block mb-2 font-medium">
            Starting Bid
          </label>

          <input
            type="number"
            min="0"
            placeholder="Enter starting bid"
            value={startingBid}
            onChange={(e) =>
              setStartingBid(e.target.value)
            }
            className="border rounded-lg p-3 w-full"
          />
        </div>

        {/* Reserve Price */}

        <div>
          <label className="block mb-2 font-medium">
            Reserve Price
          </label>

          <input
            type="number"
            min="0"
            placeholder="Optional"
            value={reservePrice}
            onChange={(e) =>
              setReservePrice(e.target.value)
            }
            className="border rounded-lg p-3 w-full"
          />

          <p className="text-xs text-gray-500 mt-1">
            Hidden minimum selling price.
          </p>
        </div>

        {/* Buy Now Price */}

        <div>
          <label className="block mb-2 font-medium">
            Buy Now Price
          </label>

          <input
            type="number"
            min="0"
            placeholder="Optional"
            value={buyNowPrice}
            onChange={(e) =>
              setBuyNowPrice(e.target.value)
            }
            className="border rounded-lg p-3 w-full"
          />

          <p className="text-xs text-gray-500 mt-1">
            Buyers can instantly purchase the item.
          </p>
        </div>

        {/* Minimum Increment */}

        <div>
          <label className="block mb-2 font-medium">
            Minimum Bid Increment
          </label>

          <input
            type="number"
            min="1"
            placeholder="e.g. 5000"
            value={minimumIncrement}
            onChange={(e) =>
              setMinimumIncrement(e.target.value)
            }
            className="border rounded-lg p-3 w-full"
          />

          <p className="text-xs text-gray-500 mt-1">
            Minimum amount each new bid must increase by.
          </p>
        </div>

        {/* Auction Start Date */}

        <div>
          <label className="block mb-2 font-medium">
            Auction Starts
          </label>

          <input
            type="datetime-local"
            value={startDate}
            min={minimumDateTime}
            onChange={(e) =>
              setStartDate(e.target.value)
            }
            className="border rounded-lg p-3 w-full"
          />

          <p className="text-xs text-gray-500 mt-1">
            The start date cannot be in the past.
          </p>
        </div>

        {/* Auction End Date */}

        <div>
          <label className="block mb-2 font-medium">
            Auction Ends
          </label>

          <input
            type="datetime-local"
            value={endDate}
            min={
              startDate ||
              minimumDateTime
            }
            onChange={(e) =>
              setEndDate(e.target.value)
            }
            className="border rounded-lg p-3 w-full"
          />

          <p className="text-xs text-gray-500 mt-1">
            The end date must be after the start date.
          </p>
        </div>

      </div>

    </div>
  );
}