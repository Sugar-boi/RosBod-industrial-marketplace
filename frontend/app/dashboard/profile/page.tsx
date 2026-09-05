"use client";

import { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/api-config";

export default function ProfilePage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        companyName: "",
        location: "",
        about: "",
        phone: "",
        whatsapp: "",
        avatar: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const isIncomplete =
        !formData.phone?.trim() ||
        !formData.whatsapp?.trim() ||
        !formData.location?.trim();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);

                const token = localStorage.getItem("token");
                const res = await fetch(
                    `${API_BASE_URL}/api/sellers/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || "Failed to load profile");
                }

                setFormData({
                    name: data.name || "",
                    email: data.email || "",
                    companyName: data.companyName || "",
                    location: data.location || "",
                    about: data.about || "",
                    phone: data.phone || "",
                    whatsapp: data.whatsapp || "",
                    avatar: data.avatar || "",
                });
            } catch (err: any) {
                setError(err.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const updateField = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleAvatarUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            setError(null);

            // Prefer your backend upload if you have it:
            // POST /api/uploads  FormData with "file"
            const body = new FormData();
            body.append("images", file);

            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/api/uploads`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body,
            });

            // if server returns HTML, this is the failure mode you saw
            const text = await res.text();
            let data: any;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error(
                    `Upload failed (${res.status}). Check /api/uploads route.`
                );
            }

            if (!res.ok) {
                throw new Error(data.message || "Upload failed");
            }

            const url = Array.isArray(data) ? data[0] : data.url || data.secure_url;
            if (!url) {
                throw new Error("No image URL returned");
            }

            updateField("avatar", url);
        } catch (err: any) {
            setError(err.message || "Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const saveProfile = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccess(null);

            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/api/sellers/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    companyName: formData.companyName,
                    location: formData.location,
                    about: formData.about,
                    phone: formData.phone,
                    whatsapp: formData.whatsapp,
                    avatar: formData.avatar || null,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to update profile");
            }

            // keep localStorage user in sync (sidebar avatar/name)
            const raw = localStorage.getItem("user");
            if (raw && raw !== "undefined") {
                const current = JSON.parse(raw);
                const updated = {
                    ...current,
                    name: formData.name || current.name,
                    phone: formData.phone,
                    whatsapp: formData.whatsapp,
                    companyName: formData.companyName,
                    location: formData.location,
                    about: formData.about,
                    avatar: formData.avatar || current.avatar,
                };
                localStorage.setItem("user", JSON.stringify(updated));
                window.dispatchEvent(new Event("authChanged"));
            }

            setSuccess("Profile updated successfully");
        } catch (err: any) {
            setError(err.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-sm text-gray-500">Loading profile...</div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f5]">
            <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
                <div className="mb-6">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d97706]">
                        Seller workspace
                    </p>
                    <h1 className="mt-1 text-2xl font-extrabold text-[#24272b] sm:text-3xl">
                        My Profile
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Update your public seller details and contact info.
                    </p>
                </div>

                {isIncomplete && (
                    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                        <p className="font-bold">Complete your seller profile</p>
                        <p className="mt-1 text-amber-800">
                            Add your phone, WhatsApp, and location so buyers can
                            reach you. If you signed up with Google, this is the
                            place to finish your details.
                        </p>
                    </div>
                )}

                {error && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {success}
                    </div>
                )}

                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                    {/* Avatar */}
                    <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-xl font-bold text-gray-600">
                            {formData.avatar ? (
                                <img
                                    src={formData.avatar}
                                    alt="Avatar"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                (formData.name || "S").charAt(0).toUpperCase()
                            )}
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-[#24272b]">
                                Profile photo
                            </p>
                            <p className="mt-0.5 text-xs text-gray-500">
                                JPG or PNG, recommended square image.
                            </p>
                            <label className="mt-2 inline-flex cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50">
                                {uploading ? "Uploading..." : "Upload photo"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={uploading}
                                    onChange={handleAvatarUpload}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-[11px] font-semibold text-[#202226]">
                                Full name
                            </label>
                            <input
                                value={formData.name}
                                onChange={(e) =>
                                    updateField("name", e.target.value)
                                }
                                className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#ff9900] focus:ring-2 focus:ring-orange-100"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-[11px] font-semibold text-[#202226]">
                                Email
                            </label>
                            <input
                                value={formData.email}
                                disabled
                                className="h-11 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-500"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-[11px] font-semibold text-[#202226]">
                                Company name
                            </label>
                            <input
                                value={formData.companyName}
                                onChange={(e) =>
                                    updateField("companyName", e.target.value)
                                }
                                placeholder="Optional"
                                className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#ff9900] focus:ring-2 focus:ring-orange-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[11px] font-semibold text-[#202226]">
                                Phone
                            </label>
                            <input
                                value={formData.phone}
                                onChange={(e) =>
                                    updateField("phone", e.target.value)
                                }
                                placeholder="+234..."
                                className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#ff9900] focus:ring-2 focus:ring-orange-100"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[11px] font-semibold text-[#202226]">
                                WhatsApp
                            </label>
                            <input
                                value={formData.whatsapp}
                                onChange={(e) =>
                                    updateField("whatsapp", e.target.value)
                                }
                                placeholder="+234..."
                                className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#ff9900] focus:ring-2 focus:ring-orange-100"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-[11px] font-semibold text-[#202226]">
                                Location
                            </label>
                            <input
                                value={formData.location}
                                onChange={(e) =>
                                    updateField("location", e.target.value)
                                }
                                placeholder="City, State"
                                className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#ff9900] focus:ring-2 focus:ring-orange-100"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-[11px] font-semibold text-[#202226]">
                                About
                            </label>
                            <textarea
                                value={formData.about}
                                onChange={(e) =>
                                    updateField("about", e.target.value)
                                }
                                rows={5}
                                placeholder="Tell buyers about your business..."
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#ff9900] focus:ring-2 focus:ring-orange-100"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={saveProfile}
                            disabled={saving}
                            className="rounded-xl bg-[#ff9900] px-6 py-3 text-sm font-extrabold text-[#24272b] transition hover:bg-[#ffad28] disabled:opacity-60"
                        >
                            {saving ? "Saving..." : "Save profile"}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}