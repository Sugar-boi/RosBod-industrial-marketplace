"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API_BASE_URL from "@/lib/api-config";
import DashboardCard from "@/components/DashboardCard";
import ListingPerformanceChart
    from "@/components/ListingPerformanceChart";

export default function DashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);

    const [user, setUser] = useState<any>(null)
    const [activeAuction, setActiveAuction] = useState<any>(null);
    const [perfDays, setPerfDays] = useState(30);
    const [perfData, setPerfData] = useState<
        { day: string; views: number; date?: string }[]
    >([]);

    useEffect(() => {
        if (user?.role !== "SELLER") return;

        const loadActiveAuction = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(
                    `${API_BASE_URL}/api/sellers/my-auctions`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();
                const auctions = Array.isArray(data) ? data : [];

                // Prefer LIVE, then SCHEDULED, else latest
                const live = auctions.find(
                    (a) => (a.status || "").toUpperCase() === "LIVE"
                );
                const scheduled = auctions.find(
                    (a) => (a.status || "").toUpperCase() === "SCHEDULED"
                );

                const chosen =
                    live ||
                    scheduled ||
                    auctions.sort(
                        (a, b) =>
                            new Date(b.createdAt || 0).getTime() -
                            new Date(a.createdAt || 0).getTime()
                    )[0] ||
                    null;

                setActiveAuction(chosen);
            } catch (err) {
                console.error(err);
                setActiveAuction(null);
            }
        };

        loadActiveAuction();
    }, [user]);

    useEffect(() => {
        const storedUser =
            localStorage.getItem("user");

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);

            if (parsedUser.role === "ADMIN") {
                router.push("/admin");
                return;
            }

            setUser(parsedUser);
        }
    }, [router]);

    const token = localStorage.getItem("token");

    console.log("Admin token:", token);

    // Buyer stats
    useEffect(() => {
        if (user?.role !== "BUYER") return;

        const fetchBuyerStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(
                    `${API_BASE_URL}/api/buyer/dashboard`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBuyerStats();
    }, [user]);


    useEffect(() => {
        const refreshUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            const raw = localStorage.getItem("user");
            const current =
                raw && raw !== "undefined" ? JSON.parse(raw) : null;
            if (!current || current.role !== "SELLER") return;

            try {
                // use the endpoint you already have for the logged-in user
                const res = await fetch(`${API_BASE_URL}/api/sellers/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) return;

                const profile = await res.json();
                console.log("PROFILE FROM API:", profile); // debug

                const updated = {
                    ...current,
                    ...profile,
                    // ensure these are present
                    isApproved: profile.isApproved ?? current.isApproved,
                    role: profile.role ?? current.role,
                };

                localStorage.setItem("user", JSON.stringify(updated));
                setUser(updated); // if this component holds user state
                window.dispatchEvent(new Event("authChanged"));
            } catch (err) {
                console.error(err);
            }
        };

        refreshUser();

        // also refresh when tab is focused again
        window.addEventListener("focus", refreshUser);
        return () => window.removeEventListener("focus", refreshUser);
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token =
                    localStorage.getItem("token");

                let url = "";

                if (user?.role === "ADMIN") {
                    url =
                        `${API_BASE_URL}/api/admin/dashboard-stats`;
                }

                if (user?.role === "SELLER") {
                    url =
                        `${API_BASE_URL}/api/sellers/dashboard-stats`;
                }

                if (!url) return;

                const res = await fetch(url, {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                });

                const data =
                    await res.json();

                setStats(data);
            } catch (error) {
                console.error(error);
            }

        };

        if (user) {
            fetchStats();
        }
    }, [user]);

    useEffect(() => {
        if (user?.role !== "SELLER") return;

        const load = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(
                    `${API_BASE_URL}/api/sellers/listing-performance?days=${perfDays}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const data = await res.json();
                if (!res.ok) return;

                const raw = Array.isArray(data.points) ? data.points : [];

                // normalize: support views OR count
                const normalized = raw.map((p: any, i: number) => ({
                    day: String(p.day ?? i + 1),
                    views: Number(p.views ?? p.count ?? 0),
                    date: p.date,
                }));

                const points =
                    normalized.length > 0
                        ? normalized
                        : Array.from({ length: perfDays }, (_, i) => ({
                            day: String(i + 1),
                            views: 0,
                        }));
                console.log("perfData", points);


                setPerfData(points);
            } catch (err) {
                console.error(err);
                // keep a flat line on error
                setPerfData(
                    Array.from({ length: perfDays }, (_, i) => ({
                        day: String(i + 1),
                        views: 0,
                    }))
                );
            }
        };

        load();
    }, [user, perfDays]);

    if (!user) {
        return (
            <div className="p-10">
                Loading...
            </div>
        );
    }


    // const activeAuction = {
    //     title:
    //         "CAT D8T Bulldozer",

    //     image:
    //         "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=1200&q=80",

    //     currentBid:
    //         82000000,

    //     bidCount:
    //         14,

    //     endDate:
    //         "2026-08-08T18:00:00",

    //     status:
    //         "Live",
    // };

    // const activeAuction =
    // dashboardData.activeAuction;
    const getAuctionImage = (auction: any) => {
        const imgs =
            auction?.listing?.images ||
            auction?.listing?.listingimage ||
            [];
        return imgs[0]?.imageUrl || null;
    };

    const formatMoney = (n: any) =>
        `₦${Number(n || 0).toLocaleString()}`;

    const formatEnd = (d?: string) => {
        if (!d) return "—";
        return new Date(d).toLocaleString("en-NG", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <main className="min-h-screen bg-[#f7f8fa]">

            <div
                className="
              mx-auto
              max-w-7xl
              px-4
              py-5
              sm:px-6
              sm:py-8
              lg:px-8
              lg:py-10
            "
            >
                <div
                    className="
    mb-6
    flex
    flex-col
    gap-4
    sm:mb-8
    sm:flex-row
    sm:items-center
    sm:justify-between
  "
                >
                    <div>

                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d97706]">
                            {user?.role === "BUYER" ? "Buyer Workspace" : "Seller Workspace"}
                        </p>

                        <h1 className="mt-2 text-3xl font-extrabold text-[#24272b] sm:text-4xl">
                            {user?.role === "BUYER" ? "Buyer Dashboard" : "Seller Dashboard"}
                        </h1>

                        <p className="mt-2 text-sm text-gray-500 sm:text-base">
                            Manage your listings, auctions and marketplace activity.
                        </p>

                    </div>

                    {(user?.role === "SELLER" ||
                        user?.role === "ADMIN") && (

                            <div className="grid grid-cols-2 gap-3 sm:flex">

                                <Link
                                    href="/create-listing"
                                    className="
          flex
          items-center
          justify-center
          rounded-xl
          border
          border-gray-300
          bg-white
          px-4
          py-3
          text-sm
          font-bold
          text-[#24272b]
          shadow-sm
          transition
          hover:border-gray-400
        "
                                >
                                    + New Listing
                                </Link>

                                <Link
                                    href="/create-auction"
                                    className="
          flex
          items-center
          justify-center
          rounded-xl
          bg-[#ff9900]
          px-4
          py-3
          text-sm
          font-bold
          text-white
          shadow-sm
          transition
          hover:bg-[#e88900]
        "
                                >
                                    + New Auction
                                </Link>

                            </div>

                        )}

                </div>

                {user?.role === "SELLER" &&
                    (!user.phone || !user.whatsapp || !user.location) && (
                        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                            <p className="font-bold">Finish your seller profile</p>
                            <p className="mt-1">
                                Add phone, WhatsApp, and location so buyers can contact you.{" "}
                                <a href="/dashboard/profile" className="font-bold underline">
                                    Update profile →
                                </a>
                            </p>
                        </div>
                    )}

                <div
                    className="
    mb-6
    rounded-2xl
    border
    border-gray-200
    bg-white
    p-5
    shadow-sm
    sm:mb-8
    sm:p-6
  "
                >
                    <div
                        className="
      flex
      flex-col
      gap-4
      sm:flex-row
      sm:items-center
      sm:justify-between
    "
                    >

                        <div>

                            <p className="text-sm font-medium text-gray-500">
                                Welcome back
                            </p>

                            <h2 className="mt-1 text-2xl font-extrabold text-[#24272b]">
                                {user.name} 👋
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                Here’s an overview of your marketplace activity.
                            </p>

                        </div>

                        <Link
                            href="/dashboard/profile"
                            className="
        inline-flex
        w-fit
        items-center
        rounded-xl
        border
        border-gray-300
        bg-white
        px-4
        py-2.5
        text-sm
        font-semibold
        text-[#24272b]
        transition
        hover:bg-gray-50
      "
                        >
                            View Profile →
                        </Link>

                    </div>
                </div>
                {user?.role === "SELLER" && user?.isApproved === false && (
                    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                        <p className="font-bold">Account pending approval</p>
                        <p className="mt-1 text-amber-800">
                            You can browse the marketplace, but you can&apos;t create listings or
                            auctions until an administrator approves your seller account.
                        </p>
                    </div>
                )}



                {user?.role === "SELLER" && (
                    <>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">

                            <DashboardCard
                                title="Active Listings"
                                value={stats?.activeListings ?? 0}
                                icon="📦"
                                color="bg-blue-100"
                                href="/dashboard/my-listings?filter=active"
                            />

                            <DashboardCard
                                title="Sold Listings"
                                value={stats?.soldListings ?? 0}
                                icon="🔴"
                                color="bg-red-100"
                                href="/dashboard/my-listings?filter=sold"
                            />

                            <DashboardCard
                                title="Pending Approval"
                                value={stats?.pendingListings ?? 0}
                                icon="⏳"
                                color="bg-yellow-100"
                                href="/dashboard/my-listings?filter=pending"
                            />

                            <DashboardCard
                                title="Reviews"
                                value={stats?.reviewsReceived ?? 0}
                                icon="⭐"
                                color="bg-green-100"
                                href="/dashboard/reviews"
                            />

                            <DashboardCard
                                title="Active Auctions"
                                value={stats?.activeAuctions ?? 0}
                                icon="🔨"
                                color="bg-purple-100"
                                href="/dashboard/my-auctions"
                            />

                        </div>

                        {/* LISTING PERFORMANCE + LISTING SUMMARY */}

                        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">

                            {/* LISTING PERFORMANCE */}

                            <section className="min-w-0 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                    <div>

                                        <h2 className="text-sm font-bold text-[#24272b]">

                                            Listing Views — Last 30 Days

                                        </h2>

                                        <p className="mt-1 text-xs text-gray-500">

                                            Track how buyers are engaging with your listings.

                                        </p>

                                    </div>

                                    <select
                                        value={perfDays}
                                        onChange={(e) => setPerfDays(Number(e.target.value))}
                                        className="
          w-full
          rounded-lg
          border
          border-gray-200
          bg-white
          px-3
          py-2
          text-xs
          font-medium
          text-gray-600
          outline-none
          sm:w-auto
        "
                                    >

                                        <option value={7}>Last 7 Days</option>
                                        <option value={30}>Last 30 Days</option>
                                        <option value={90}>Last 90 Days</option>
                                    </select>

                                </div>

                                <div className="mt-5 h-[260px] w-full">
                                    <ListingPerformanceChart data={perfData} />

                                </div>

                            </section>


                            {/* LISTING SUMMARY */}

                            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                                <div className="flex items-center justify-between">

                                    <h2 className="text-sm font-bold text-[#24272b]">

                                        Listing Summary

                                    </h2>

                                    <Link
                                        href="/dashboard/my-listings"
                                        className="text-xs font-semibold text-[#d97706] hover:underline"
                                    >

                                        Manage →

                                    </Link>

                                </div>



                                <div className="mt-5 space-y-4">

                                    {/* PENDING */}

                                    <div>

                                        <div className="mb-1.5 flex justify-between text-xs">

                                            <span className="font-medium text-gray-600">

                                                Pending

                                            </span>

                                            <span className="font-bold text-[#24272b]">

                                                {stats?.pendingListings ?? 0}

                                            </span>

                                        </div>

                                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">

                                            <div className="h-full w-[20%] rounded-full bg-orange-400" />

                                        </div>

                                    </div>


                                    {/* REJECTED */}

                                    <div>

                                        <div className="mb-1.5 flex justify-between text-xs">

                                            <span className="font-medium text-gray-600">

                                                Rejected

                                            </span>

                                            <span className="font-bold text-[#24272b]">

                                                3

                                            </span>

                                        </div>

                                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">

                                            <div className="h-full w-[8%] rounded-full bg-red-400" />

                                        </div>

                                    </div>


                                    {/* SOLD */}

                                    <div>

                                        <div className="mb-1.5 flex justify-between text-xs">

                                            <span className="font-medium text-gray-600">

                                                Sold

                                            </span>

                                            <span className="font-bold text-[#24272b]">

                                                {stats?.soldListings ?? 0}

                                            </span>

                                        </div>

                                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">

                                            <div className="h-full w-[55%] rounded-full bg-purple-400" />

                                        </div>

                                    </div>


                                    {/* AUCTIONS */}

                                    <div>

                                        <div className="mb-1.5 flex justify-between text-xs">

                                            <span className="font-medium text-gray-600">

                                                Auctions

                                            </span>

                                            <span className="font-bold text-[#24272b]">

                                                {stats?.activeAuctions ?? 0}

                                            </span>

                                        </div>

                                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">

                                            <div className="h-full w-[70%] rounded-full bg-blue-400" />

                                        </div>

                                    </div>

                                </div>

                                <Link
                                    href="/dashboard/my-listings"
                                    className="
        mt-6
        flex
        w-full
        items-center
        justify-center
        rounded-lg
        border
        border-gray-200
        px-4
        py-2.5
        text-xs
        font-semibold
        text-[#24272b]
        transition
        hover:bg-gray-50
      "
                                >

                                    View All Listings

                                </Link>

                            </section>



                        </div>



                        {/* DASHBOARD LOWER SECTIONS */}

                        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)]">

                            {/* LEFT COLUMN */}

                            <div className="space-y-6">

                                {/* RECENT ACTIVITY */}

                                <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <h2 className="text-sm font-bold text-[#24272b]">

                                                Recent Activity

                                            </h2>

                                            <p className="mt-1 text-xs text-gray-500">

                                                Latest updates from your marketplace account.

                                            </p>

                                        </div>

                                        <Link
                                            href="/dashboard/activity"
                                            className="text-xs font-semibold text-[#d97706] hover:underline"
                                        >

                                            View all

                                        </Link>

                                    </div>

                                    <div className="mt-5 divide-y divide-gray-100">

                                        <div className="flex items-start gap-3 py-3">

                                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50 text-sm">

                                                ✓

                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <p className="text-xs font-semibold text-[#24272b]">

                                                    Listing Approved

                                                </p>

                                                <p className="mt-1 truncate text-[11px] text-gray-500">

                                                    2019 CAT 320 Hydraulic Excavator

                                                </p>

                                            </div>

                                            <span className="shrink-0 text-[10px] text-gray-400">

                                                2 hrs ago

                                            </span>

                                        </div>

                                        <div className="flex items-start gap-3 py-3">

                                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-sm">

                                                ₦

                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <p className="text-xs font-semibold text-[#24272b]">

                                                    New Bid Received

                                                </p>

                                                <p className="mt-1 truncate text-[11px] text-gray-500">

                                                    CAT D8 Bulldozer — ₦82,000,000

                                                </p>

                                            </div>

                                            <span className="shrink-0 text-[10px] text-gray-400">

                                                4 hrs ago

                                            </span>

                                        </div>

                                        <div className="flex items-start gap-3 py-3">

                                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-sm">

                                                ✕

                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <p className="text-xs font-semibold text-[#24272b]">

                                                    Listing Rejected

                                                </p>

                                                <p className="mt-1 truncate text-[11px] text-gray-500">

                                                    Please update the listing details.

                                                </p>

                                            </div>

                                            <span className="shrink-0 text-[10px] text-gray-400">

                                                Yesterday

                                            </span>

                                        </div>

                                        <div className="flex items-start gap-3 py-3">

                                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-sm">

                                                ◈

                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <p className="text-xs font-semibold text-[#24272b]">

                                                    Listing Sold

                                                </p>

                                                <p className="mt-1 truncate text-[11px] text-gray-500">

                                                    Toyota 7FG Forklift — ₦6,500,000

                                                </p>

                                            </div>

                                            <span className="shrink-0 text-[10px] text-gray-400">

                                                Jan 22

                                            </span>

                                        </div>

                                        <div className="flex items-start gap-3 py-3">

                                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm">

                                                ★

                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <p className="text-xs font-semibold text-[#24272b]">

                                                    New Review Received

                                                </p>

                                                <p className="mt-1 truncate text-[11px] text-gray-500">

                                                    “Excellent seller, very professional.”

                                                </p>

                                            </div>

                                            <span className="shrink-0 text-[10px] text-gray-400">

                                                Jan 21

                                            </span>

                                        </div>

                                    </div>

                                </section>

                            </div>

                        </div>


                        {/* ACTIVE AUCTION */}
                        {activeAuction ? (
                            <section className="mt-6 overflow-hidden rounded-2xl bg-[#172033] text-white shadow-sm">
                                <div className="grid lg:grid-cols-[280px_minmax(0,1fr)]">
                                    {/* IMAGE */}
                                    <div className="relative min-h-[220px] overflow-hidden bg-slate-800 sm:min-h-[260px]">
                                        {getAuctionImage(activeAuction) ? (
                                            <img
                                                src={getAuctionImage(activeAuction)!}
                                                alt={activeAuction.listing?.title || "Auction"}
                                                className="absolute inset-0 h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
                                                No image
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                                        <span className="absolute left-4 top-4 rounded-full bg-[#ff9900] px-3 py-1.5 text-[11px] font-extrabold text-[#24272b] shadow">
                                            🔨 {(activeAuction.status || "AUCTION").toUpperCase()}
                                        </span>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="flex min-w-0 flex-col justify-between p-5 sm:p-7">
                                        <div>
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
                                                        Your auction
                                                    </p>
                                                    <h2 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">
                                                        {activeAuction.listing?.title || "Untitled auction"}
                                                    </h2>
                                                </div>

                                                <span className="w-fit rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1.5 text-xs font-bold text-green-300">
                                                    ● {(activeAuction.status || "—").toUpperCase()}
                                                </span>
                                            </div>

                                            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                                        Current Bid
                                                    </p>
                                                    <p className="mt-2 text-lg font-extrabold text-white sm:text-xl">
                                                        {formatMoney(activeAuction.currentBid)}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                                        Total Bids
                                                    </p>
                                                    <p className="mt-2 text-lg font-extrabold text-white sm:text-xl">
                                                        {activeAuction.bids?.length ??
                                                            activeAuction.bid?.length ??
                                                            0}
                                                    </p>
                                                </div>

                                                <div className="col-span-2 rounded-xl border border-white/10 bg-white/5 p-4 sm:col-span-1">
                                                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                                        Auction Ends
                                                    </p>
                                                    <p className="mt-2 text-sm font-bold text-white">
                                                        {formatEnd(activeAuction.endDate)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <p className="text-xs text-slate-400">
                                                Monitor bids and manage your auction activity.
                                            </p>

                                            <Link
                                                href={`/auctions/${activeAuction.id}`}
                                                className="inline-flex items-center justify-center rounded-xl bg-[#ff9900] px-5 py-3 text-sm font-extrabold text-[#24272b] transition hover:bg-[#ffad33]"
                                            >
                                                Manage Auction →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        ) : (
                            <section className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
                                <p className="font-bold text-[#24272b]">No active auctions yet</p>
                                <p className="mt-1 text-sm text-gray-500">
                                    When you have a live or scheduled auction, it will show here.
                                </p>
                                <Link
                                    href="/create-auction"
                                    className="mt-4 inline-flex rounded-xl bg-[#ff9900] px-5 py-3 text-sm font-extrabold text-[#24272b]"
                                >
                                    + New auction
                                </Link>
                            </section>
                        )}
                    </>
                )}

                {user?.role === "BUYER" && (
                    <>
                        <div className="mb-6">

                            <p className="mt-2 text-sm text-gray-500">
                                Track your saved listings, bids and won auctions.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {/* <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h2 className="text-sm text-gray-500">Saved Listings</h2>
                                <p className="mt-3 text-3xl font-bold text-[#24272b]">
                                    {stats?.saved ?? 0}
                                </p>
                            </div> */}

                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h2 className="text-sm text-gray-500">Active Bids</h2>
                                <p className="mt-3 text-3xl font-bold text-[#24272b]">
                                    {stats?.activeBids ?? 0}
                                </p>
                            </div>

                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h2 className="text-sm text-gray-500">Won Auctions</h2>
                                <p className="mt-3 text-3xl font-bold text-[#24272b]">
                                    {stats?.wonAuctions ?? 0}
                                </p>
                            </div>

                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h2 className="text-sm text-gray-500">Notifications</h2>
                                <p className="mt-3 text-3xl font-bold text-[#24272b]">
                                    {stats?.notifications ?? 0}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>

        </main>
    );
}