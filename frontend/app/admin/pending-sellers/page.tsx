"use client";

import { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/api-config";

export default function PendingSellersPage() {
    const [sellers, setSellers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [approvingId, setApprovingId] = useState<number | null>(null);

    const fetchSellers = async () => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem("token");
            const res = await fetch(
                `${API_BASE_URL}/api/admin/pending-sellers`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to load");
            setSellers(Array.isArray(data) ? data : []);
        } catch (err: any) {
            setError(err.message || "Failed to load pending sellers");
            setSellers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSellers();
    }, []);

    const approveSeller = async (id: number) => {
        try {
            setApprovingId(id);
            setSuccess("");
            setError("");
            const token = localStorage.getItem("token");
            const res = await fetch(
                `${API_BASE_URL}/api/admin/approve-seller/${id}`,
                {
                    method: "PUT",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || "Approve failed");

            setSuccess("Seller approved. Approval email sent if mail is configured.");
            setSellers((prev) => prev.filter((s) => s.id !== id));
        } catch (err: any) {
            setError(err.message || "Failed to approve seller");
        } finally {
            setApprovingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[50vh] bg-[#f7f7f5] p-6 sm:p-8">
                <div className="mx-auto max-w-[1100px]">
                    <div className="h-8 w-56 animate-pulse rounded bg-gray-200" />
                    <div className="mt-6 h-40 animate-pulse rounded-xl bg-white border" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f5]">
            <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-extrabold text-[#202226] sm:text-3xl">
                    Pending Sellers
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Review and approve seller accounts before they can list assets.
                </p>

                {error && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {success}
                    </div>
                )}

                <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    {sellers.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <p className="font-bold text-[#202226]">No pending sellers</p>
                            <p className="mt-1 text-sm text-gray-500">
                                New seller registrations will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {sellers.map((seller) => (
                                <div
                                    key={seller.id}
                                    className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-[#d97706]">
                                            {(seller.name || "?").charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate font-bold text-[#202226]">
                                                {seller.name}
                                            </p>
                                            <p className="truncate text-sm text-gray-500">
                                                {seller.email}
                                            </p>
                                            <p className="mt-0.5 text-xs text-gray-400">
                                                {seller.companyName || "No company"} ·{" "}
                                                {seller.createdAt
                                                    ? new Date(seller.createdAt).toLocaleDateString(
                                                        "en-NG"
                                                    )
                                                    : "—"}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        disabled={approvingId === seller.id}
                                        onClick={() => approveSeller(seller.id)}
                                        className="rounded-lg bg-[#16a34a] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#15803d] disabled:opacity-60"
                                    >
                                        {approvingId === seller.id ? "Approving..." : "Approve"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}