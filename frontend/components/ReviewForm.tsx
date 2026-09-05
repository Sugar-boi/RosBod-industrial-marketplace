"use client";

import { useState } from "react";
import API_BASE_URL from "@/lib/api-config";

export default function ReviewForm(
  {
  listingId,
  onSuccess,
}: {
  listingId: number;
  onSuccess: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitReview = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    const res = await fetch(
      `${API_BASE_URL}/api/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listingId,
          rating,
          comment,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    setComment("");

    alert("Review submitted!");

    onSuccess();
  };

  return (
    <div className="border rounded-xl p-6 mb-8">

      <h3 className="text-2xl font-bold mb-4">
        Leave a Review
      </h3>

      <div className="flex gap-2 mb-6">

        {[1, 2, 3, 4, 5].map((star) => (

          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="text-4xl transition hover:scale-110"
          >
            {star <= rating ? "⭐" : "☆"}
          </button>
        ))}
        <p className="text-gray-500 mb-4">
          {rating} out of 5 stars
        </p>

      </div>

      <textarea
        className="border rounded p-3 w-full"
        rows={4}
        placeholder="Write your experience..."
        value={comment}
        onChange={(e) =>
          setComment(e.target.value)
        }
      />

      <button
        onClick={submitReview}
        className="mt-4 bg-orange-600 text-white px-6 py-3 rounded-xl w-full
        hover:bg-orange-700
        transition"
      >
        ⭐ Submit Review
      </button>

    </div>
  );
}