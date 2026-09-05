"use client";

import { useEffect, useMemo, useState } from "react";
import API_BASE_URL from "@/lib/api-config";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setUsers(Array.isArray(data) ? data : []);
            } catch {
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q) return users;
        return users.filter(
            (u) =>
                u.name?.toLowerCase().includes(q) ||
                u.email?.toLowerCase().includes(q) ||
                u.role?.toLowerCase().includes(q)
        );
    }, [users, search]);

    const roleBadge = (role: string) => {
        if (role === "ADMIN") return "bg-purple-50 text-purple-700";
        if (role === "SELLER") return "bg-orange-50 text-orange-700";
        return "bg-blue-50 text-blue-700";
    };

    if (loading) {
        return (
            <div className="min-h-[50vh] bg-[#f7f7f5] p-8">
                <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f5]">
            <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-extrabold text-[#202226] sm:text-3xl">
                    Users
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    All accounts on the marketplace.
                </p>

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, email, role..."
                    className="mt-5 h-11 w-full max-w-md rounded-lg border border-gray-200 bg-white px-4 text-sm outline-none focus:border-[#ff9900]"
                />

                <section className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px] text-left text-sm">
                            <thead className="bg-[#fafaf9] text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((user) => (
                                    <tr key={user.id} className="hover:bg-[#fffaf3]">
                                        <td className="px-4 py-3 font-semibold text-[#202226]">
                                            {user.name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{user.email}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-md px-2 py-1 text-[10px] font-bold ${roleBadge(
                                                    user.role
                                                )}`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString("en-NG")
                                                : "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}