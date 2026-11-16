"use client";

import { useState } from "react";
import API_BASE_URL from "@/lib/api-config";

export default function ReviewForm({
  listingId,
  onSuccess,
}: {
  listingId: number;
  onSuccess: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const submitReview = async () => {
    setMessage(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ type: "error", text: "Please log in first." });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
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
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({
          type: "error",
          text: data.message || "Failed to submit review",
        });
        return;
      }

      setComment("");
      setMessage({ type: "success", text: "Review submitted." });
      onSuccess();
    } catch {
      setMessage({ type: "error", text: "Failed to submit review" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-base font-extrabold text-[#24272b]">
        Leave a review
      </h3>

      {message && (
        <div
          className={`mt-3 rounded-lg px-3 py-2 text-sm ${message.type === "success"
              ? "border border-green-200 bg-green-50 text-green-800"
              : "border border-red-200 bg-red-50 text-red-700"
            }`}
        >
          {message.text}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="text-2xl transition hover:scale-110"
          >
            {star <= rating ? "⭐" : "☆"}
          </button>
        ))}
        <p className="text-sm text-gray-500">{rating} out of 5</p>
      </div>

      <textarea
        className="mt-4 w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-[#ff9900]"
        rows={4}
        placeholder="Write your experience..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        type="button"
        onClick={submitReview}
        disabled={loading}
        className="mt-4 w-full rounded-xl bg-[#ff9900] px-6 py-3 text-sm font-extrabold text-[#24272b] transition hover:bg-[#ffad28] disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit review"}
      </button>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import API_BASE_URL from "@/lib/api-config";

// export default function ReviewForm(
//   {
//   listingId,
//   onSuccess,
// }: {
//   listingId: number;
//   onSuccess: () => void;
// }) {
//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");

//   const submitReview = async () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       alert("Please login first.");
//       return;
//     }

//     const res = await fetch(
//       `${API_BASE_URL}/api/reviews`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           listingId,
//           rating,
//           comment,
//         }),
//       }
//     );

//     const data = await res.json();

//     if (!res.ok) {
//       alert(data.message);
//       return;
//     }

//     setComment("");

//     alert("Review submitted!");

//     onSuccess();
//   };

//   return (
//     <div className="border rounded-xl p-6 mb-8">

//       <h3 className="text-2xl font-bold mb-4">
//         Leave a Review
//       </h3>

//       <div className="flex gap-2 mb-6">

//         {[1, 2, 3, 4, 5].map((star) => (

//           <button
//             key={star}
//             type="button"
//             onClick={() => setRating(star)}
//             className="text-4xl transition hover:scale-110"
//           >
//             {star <= rating ? "⭐" : "☆"}
//           </button>
//         ))}
//         <p className="text-gray-500 mb-4">
//           {rating} out of 5 stars
//         </p>

//       </div>

//       <textarea
//         className="border rounded p-3 w-full"
//         rows={4}
//         placeholder="Write your experience..."
//         value={comment}
//         onChange={(e) =>
//           setComment(e.target.value)
//         }
//       />

//       <button
//         onClick={submitReview}
//         className="mt-4 bg-orange-600 text-white px-6 py-3 rounded-xl w-full
//         hover:bg-orange-700
//         transition"
//       >
//         ⭐ Submit Review
//       </button>

//     </div>
//   );
// }