"use client";

import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import API_BASE_URL from "@/lib/api-config";

interface Props {
    imageUrls: string[];
    setImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
    maxImages?: number;
}

export default function ImageUploader({
    imageUrls,
    setImageUrls,
    maxImages = 10, // backend limit is 10
}: Props) {
    const [uploading, setUploading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const slides = imageUrls.map((url) => ({
        src: url,
    }));

    const handleUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (imageUrls.length + files.length > maxImages) {
            alert(`Maximum ${maxImages} images allowed.`);
            e.target.value = "";
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setError("You must be logged in to upload images.");
            e.target.value = "";
            return;
        }

        try {
            setUploading(true);
            setError(null);

            const formData = new FormData();
            // Backend expects field name "images"
            for (const file of Array.from(files)) {
                formData.append("images", file);
            }

            const res = await fetch(`${API_BASE_URL}/api/uploads`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Do NOT set Content-Type — browser sets the multipart boundary
                },
                body: formData,
            });

            if (!res.ok) {
                let message = "Upload failed";
                try {
                    const data = await res.json();
                    message = data.message || message;
                } catch {
                    // ignore
                }
                throw new Error(message);
            }

            // Backend returns array of secure_url strings
            const uploadedUrls: string[] = await res.json();

            setImageUrls((prev) => [...prev, ...uploadedUrls]);
        } catch (err: any) {
            console.error("Image upload error:", err);
            setError(err.message || "Upload failed. Please try again.");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const removeImage = (index: number) => {
        setImageUrls(imageUrls.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            {imageUrls.length < maxImages && (
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded file:border-0
                        file:text-sm file:font-semibold
                        file:bg-orange-50 file:text-orange-700
                        hover:file:bg-orange-100
                        disabled:opacity-50"
                />
            )}

            <p className="text-xs text-gray-500">
                {imageUrls.length}/{maxImages} images uploaded
            </p>

            {uploading && (
                <div className="rounded-lg bg-orange-50 p-3 text-sm text-orange-700">
                    Uploading images...
                </div>
            )}

            {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imageUrls.map((url, index) => (
                    <div key={index} className="relative">
                        <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            onClick={() => {
                                setSelectedIndex(index);
                                setOpen(true);
                            }}
                            className="w-full h-36 object-cover rounded border cursor-pointer hover:scale-105 transition"
                        />

                        <button
                            disabled={uploading}
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 rounded-full bg-red-600 px-2 text-white disabled:opacity-50"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={slides}
                index={selectedIndex}
            />
        </div>
    );
}