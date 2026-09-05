"use client";

type Props = {
  bids: any[];
};

export default function BidHistory({
  bids,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-2xl font-bold mb-6">
        Bid History
      </h2>

      {bids.length === 0 ? (

        <p className="text-gray-500">
          No bids yet.
        </p>

      ) : (

        <div className="space-y-4">

          {bids.map((bid: any) => (

            <div
              key={bid.id}
              className="flex justify-between items-center border-b pb-4"
            >

              <div>

                <p className="font-semibold">

                  {bid.user.name}

                </p>

                <p className="text-sm text-gray-500">

                  {new Date(
                    bid.createdAt
                  ).toLocaleString()}

                </p>

              </div>

              <div className="text-right">

                <h3 className="text-lg font-bold">

                  ₦{bid.amount.toLocaleString()}

                </h3>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}