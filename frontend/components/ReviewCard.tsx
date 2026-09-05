
"use client";

import Link from "next/link";

export default function ReviewCard({
  review,
}: {
  review: any;
}) {
  return (
    <div className="border rounded-xl p-5 mb-4">

      <div className="flex justify-between items-center">

        <h3 className="font-bold">
          {review.buyer.name}
        </h3>

        <div className="text-yellow-500 text-lg">
          {"⭐".repeat(review.rating)}
        </div>

      </div>
   

      <Link
        href={`/listings/${review.listing.id}`}
        className="text-orange-600 font-semibold hover:underline"
      >
        {review.listing.title}
      </Link>

      <p className="text-gray-600 mt-3">
        {review.comment}
      </p>

      <p className="text-sm text-gray-400 mt-4">
        {new Date(review.createdAt).toLocaleDateString()}
      </p>

    </div>
  );
}