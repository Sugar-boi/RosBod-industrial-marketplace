"use client";

import { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/api-config";
// import router from "next/dist/shared/lib/router/router";
import router from "next/router";



export default function CreateListingPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState<any[]>([]);
    const [isAuction, setIsAuction] = useState(false);
    const [files, setFiles] = useState<FileList | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(
                    `${API_BASE_URL}/api/categories`
                );

                const data = await res.json();

                setCategories(data);

                if (data.length > 0) {
                    setCategoryId(
                        data[0].id.toString()
                    );
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const raw = localStorage.getItem("user");
        if (raw && raw !== "undefined") {
            try {
                setUser(JSON.parse(raw));
            } catch {
                setUser(null);
            }
        }
    }, []);

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        const token =
            localStorage.getItem("token");

        const user = JSON.parse(
            localStorage.getItem("user") || "{}"
        );
        //  const user = getCurrentUser();

        console.log("TOKEN:", token);
        console.log("USER:", user);

        try {
            let imageUrls: string[] = [];

            if (files && files.length > 0) {
                const formData = new FormData();

                Array.from(files).forEach((file) => {
                    formData.append(
                        "images",
                        file
                    );
                });

                const uploadRes = await fetch(
                    `${API_BASE_URL}/api/uploads`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                imageUrls =
                    await uploadRes.json();
            }
            const response = await fetch(
                `${API_BASE_URL}/api/listing`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        price: Number(price),
                        categoryId:
                            Number(categoryId),
                        isAuction,
                        images: imageUrls,
                    }),
                }
            );


            const data =
                await response.json();

            if (!response.ok) {
                setFormError(data.message || "Failed to create listing");
                return;
            }

            setFormSuccess("Listing submitted for admin approval.");
            // optional redirect after a short delay
            setTimeout(() => {
                router.push("/dashboard/my-listings");
            }, 1200);

            setTitle("");
            setDescription("");
            setPrice("");
            setIsAuction(false);
        } catch (error) {
            console.error(error);
            setFormError("Something went wrong. Please try again.");
        }

    };


    return (
        <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">
                Create Listing
            </h1>

            

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                    className="w-full border p-3 rounded"
                />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) =>
                        setDescription(
                            e.target.value
                        )
                    }
                    className="w-full border p-3 rounded"
                />



                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) =>
                        setPrice(e.target.value)
                    }
                    className="w-full border p-3 rounded"
                />

                <select
                    value={categoryId}
                    onChange={(e) =>
                        setCategoryId(e.target.value)
                    }
                    className="w-full border p-3 rounded"
                >
                    {categories.map((category) => (
                        <option
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>

                <input
                    type="file"
                    multiple
                    onChange={(e) =>
                        setFiles(e.target.files)
                    }
                    className="w-full border p-3 rounded"
                />

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isAuction}
                        onChange={(e) =>
                            setIsAuction(e.target.checked)
                        }
                    />

                    <label>Auction Listing</label>
                </div>
                {formError && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {formError}
                    </div>
                )}

                {formSuccess && (
                    <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {formSuccess}
                    </div>
                )}
                <button
                    type="submit"
                    className="bg-black text-white px-6 py-3 rounded"
                >
                    Create Listing
                </button>
            </form>
        </div>
    );
}