"use client";

type Props = {
  auction: any;
};

export default function AuctionStatusCard({
  auction,
}: Props) {
  const now = new Date();

  const startDate = new Date(
    auction.startDate
  );

  const endDate = new Date(
    auction.endDate
  );

  let badgeText = "LIVE";

  let badgeColor =
    "bg-green-100 text-green-700";

  if (auction.listing?.isSold) {
    badgeText = "SOLD";

    badgeColor =
      "bg-purple-100 text-purple-700";
  } else if (now < startDate) {
    badgeText = "UPCOMING";

    badgeColor =
      "bg-blue-100 text-blue-700";
  } else if (now > endDate) {
    badgeText = "ENDED";

    badgeColor =
      "bg-red-100 text-red-700";
  }

  return (
    <div className="border rounded-xl p-6">

      <div className="flex items-center justify-between">

        <h2 className="text-xl font-bold">
          Auction Status
        </h2>

        <span
          className={`px-4 py-2 rounded-full text-sm font-bold ${badgeColor}`}
        >
          {badgeText}
        </span>

      </div>

      <p className="text-gray-500 mt-4">

        {badgeText === "UPCOMING" &&
          "This auction has not started yet."}

        {badgeText === "LIVE" &&
          "This auction is currently accepting bids."}

        {badgeText === "ENDED" &&
          "This auction has ended."}

        {badgeText === "SOLD" &&
          "This listing has been marked as sold."}

      </p>

    </div>
  );
}