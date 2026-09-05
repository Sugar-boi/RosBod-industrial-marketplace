"use client";

import { useEffect, useState } from "react";

import API_BASE_URL from "@/lib/api-config";

import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";

export default function ReviewSection({
  sellerId,
  listingId,
}: {
  sellerId?: number;
  listingId?: number;
}) {
  const [reviews, setReviews] = useState<any[]>([]);

  const fetchReviews = async () => {
    const url = sellerId
      ? `${API_BASE_URL}/api/reviews/${sellerId}`
      : `${API_BASE_URL}/api/reviews/listing/${listingId}`;

    const res = await fetch(url);

    const data = await res.json();

    setReviews(data);
  };

  useEffect(() => {
    fetchReviews();
  }, [sellerId, listingId]);

  const average =
    reviews.length > 0
      ? (
        reviews.reduce(
          (sum, r) => sum + r.rating,
          0
        ) / reviews.length
      ).toFixed(1)
      : null;

  return (
    <section className="mt-12">

      <h2 className="text-3xl font-bold mb-6">
        Reviews
      </h2>

      {listingId && (
        <ReviewForm
          listingId={listingId}
          onSuccess={fetchReviews}
        />
      )}


      {average && (
        <div className="mb-8">

          <p className="text-5xl font-bold">
            ⭐ {average}
          </p>

          <p className="text-gray-500">
            {reviews.length} review
            {reviews.length !== 1 && "s"}
          </p>

        </div>
      )}

      {reviews.length === 0 && (
        <p className="text-gray-500">
          No reviews yet.
        </p>
      )}

      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
        />
      ))}

    </section>
  );
}