"use client";

import { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/api-config";

export default function FavoriteButton({
    listingId,
}: {
    listingId: number;
}) {
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || !listingId) return;

        const check = async () => {
            try {
                const res = await fetch(
                    `${API_BASE_URL}/api/favorites/${listingId}/check`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) return;

                const data = await res.json();
                setSaved(!!data.favorited);
            } catch (err) {
                console.error(err);
            }
        };

        check();
    }, [listingId]);

    const handleFavorite = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please log in to save listings.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const res = await fetch(
                `${API_BASE_URL}/api/favorites/${listingId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to update favorite");
            }

            setSaved(!!data.favorited);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="inline-flex flex-col items-end">
            <button
                type="button"
                onClick={handleFavorite}
                disabled={loading}
                className="rounded-lg px-2 py-1 text-2xl transition disabled:opacity-50"
                title={saved ? "Remove from favorites" : "Add to favorites"}
            >
                {saved ? "❤️" : "🤍"}
            </button>

            {error && (
                <p className="mt-1 max-w-[160px] text-right text-[10px] text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}
// "use client";

// import { useEffect, useState } from "react";

// import {
//     isFavorite,
//     toggleFavorite,
// } from "@/lib/favorites";

// export default function FavoriteButton({
//     listingId,
// }: {
//     listingId: number;
// }) {

//     const [saved, setSaved] =
//         useState(false);

//     useEffect(() => {
//         setSaved(
//             isFavorite(listingId)
//         );
//     }, [listingId]);

//     const handleFavorite = () => {

//         const newState =
//             toggleFavorite(listingId);

//         setSaved(newState);

//     };

//     return (
//         <button
//             onClick={handleFavorite}
//             className={`mt-4 px-4 py-2 rounded  transition
//                 ${saved
//                     ? "bg-none-600 text-white "
//                     : "bg-none "
//                 }`}
//         >
//             {saved
//                 ? "❤️ "
//                 : "🤍"}
//         </button>
//     );
// }