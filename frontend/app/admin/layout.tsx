"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = {
    href: string;
    label: string;
    icon: string;
};

const overviewLinks: NavItem[] = [
    { href: "/admin", label: "Dashboard", icon: "▦" },
];

const approvalLinks: NavItem[] = [
    { href: "/admin/pending-listings", label: "Pending Listings", icon: "◎" },
    { href: "/admin/pending-sellers", label: "Pending Sellers", icon: "♟" },
    { href: "/admin/listings", label: "Approved Listings", icon: "✓" },
    { href: "/admin/auctions", label: "Auctions", icon: "⚒" },
];

const managementLinks: NavItem[] = [
    { href: "/admin/users", label: "Users", icon: "👤" },
    { href: "/admin/sellers", label: "Sellers", icon: "🏢" },
    { href: "/admin/bids", label: "Bids", icon: "◆" },
    { href: "/admin/notifications", label: "Notifications", icon: "🔔" },
];

function NavLink({
    item,
    active,
}: {
    item: NavItem;
    active: boolean;
}) {
    return (
        <Link
            href={item.href}
            className={`
        flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition
        ${
            active
                ? "bg-orange-50 text-[#d97706]"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }
      `}
        >
            <span className="w-5 text-center text-sm">{item.icon}</span>
            <span>{item.label}</span>
        </Link>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (!stored || stored === "undefined") {
            router.push("/login");
            return;
        }
        try {
            const parsed = JSON.parse(stored);
            if (parsed.role !== "ADMIN") {
                router.push("/dashboard");
                return;
            }
            setUser(parsed);
        } catch {
            router.push("/login");
        }
    }, [router]);

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("authChanged"));
        router.push("/login");
    };

    const Sidebar = (
        <aside className="flex h-full w-[260px] flex-col border-r border-gray-200 bg-white">
            {/* Brand */}
            {/* <div className="flex h-[72px] items-center gap-2.5 border-b border-gray-200 px-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#17191c] text-xs font-black text-white">
                    R
                </div>
                <div>
                    <p className="text-sm font-extrabold tracking-tight text-[#24272b]">
                        ROSBOD
                    </p>
                    <p className="text-[10px] font-medium text-gray-400">
                        Admin Panel
                    </p>
                </div>
            </div> */}

            {/* Profile */}
            <div className="border-b border-gray-200 px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-700">
                        {(user?.name || "A").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-gray-900">
                            {user?.name || "Admin"}
                        </p>
                        <p className="text-[11px] text-gray-500">
                            Administrator
                        </p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                    Overview
                </p>
                <div className="mb-5 space-y-1">
                    {overviewLinks.map((item) => (
                        <NavLink
                            key={item.href}
                            item={item}
                            active={isActive(item.href)}
                        />
                    ))}
                </div>

                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                    Approvals
                </p>
                <div className="mb-5 space-y-1">
                    {approvalLinks.map((item) => (
                        <NavLink
                            key={item.href}
                            item={item}
                            active={isActive(item.href)}
                        />
                    ))}
                </div>

                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                    Management
                </p>
                <div className="space-y-1">
                    {managementLinks.map((item) => (
                        <NavLink
                            key={item.href}
                            item={item}
                            active={isActive(item.href)}
                        />
                    ))}
                </div>
            </nav>

            {/* Sign out */}
            <div className="border-t border-gray-200 p-3">
                <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                    <span className="w-5 text-center">⏻</span>
                    Sign Out
                </button>
            </div>
        </aside>
    );

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f7f7f5] text-sm text-gray-500">
                Loading admin...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f5]">
            {/* Mobile top bar */}
            <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-lg"
                    aria-label="Open menu"
                >
                    ☰
                </button>
                <span className="text-sm font-bold text-[#24272b]">
                    Admin
                </span>
                <div className="h-10 w-10" />
            </header>

            {mobileOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    aria-label="Close menu"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <div className="mx-auto flex min-h-screen max-w-[1600px]">
                {/* Desktop sidebar */}
                <div className="sticky top-0 hidden h-screen lg:block">
                    {Sidebar}
                </div>

                {/* Mobile drawer */}
                <div
                    className={`
            fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:hidden
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          `}
                >
                    <div className="h-full" onClick={() => setMobileOpen(false)}>
                        {Sidebar}
                    </div>
                </div>

                {/* Page content — no extra padding conflict with page */}
                <main className="min-w-0 flex-1">{children}</main>
            </div>
        </div>
    );
}