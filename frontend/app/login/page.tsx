"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import API_BASE_URL from "@/lib/api-config";
import { GoogleLogin } from "@react-oauth/google";


export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const sessionExpired =
        searchParams.get("reason") === "session-expired";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            setLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password,
                    }),
                }
            );

            const data = await response.json();
            if (!response.ok) {
                if (
                    response.status === 403 &&
                    (data.message || "").toLowerCase().includes("verify")
                ) {
                    alert("Please verify your email. We'll take you to the verification page.");
                    router.push(
                        `/verify-email?email=${encodeURIComponent(email.trim())}`
                    );
                    return;
                }
                // Wrong password / invalid credentials / anything else
                setError(data.message || "Invalid email or password");
                return;
            }
            if (!data.token || !data.user) {
                setError("Login failed. Please try again.");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            window.dispatchEvent(new Event("authChanged"));

            if (data.user.role === "ADMIN") {
                router.push("/admin");
            } else {
                router.push("/dashboard");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (response: any) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    credential: response.credential,
                    // on register page you can pass role: "SELLER" or "BUYER"
                    role: "BUYER",
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Google sign-in failed");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            window.dispatchEvent(new Event("authChanged"));

            if (data.user.role === "ADMIN") {
                router.push("/admin");
            } else if (
                data.user.role === "SELLER" &&
                data.user.isApproved === false
            ) {
                router.push("/dashboard"); // pending banner shows
            } else {
                router.push("/dashboard");
            }
        } catch {
            setError("Google sign-in failed");
        }
    };

    return (
        <main className="min-h-screen bg-[#f7f7f5] px-4 py-8 sm:px-6 lg:px-10">

            {/* Top brand */}
            {/* <div className="mx-auto mb-8 flex max-w-[1200px] items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2"
                >
                    <img
                        src="/logo1.jpg"
                        alt="Rosebod"
                        className="h-8 w-8 rounded-md object-cover"
                    />

                    <span className="text-lg font-extrabold tracking-tight text-[#202226]">
                        ROSBOD
                    </span>
                </Link>

                <span className="hidden text-xs text-gray-400 sm:block">
                    Nigeria's Industrial Marketplace
                </span>
            </div> */}

            <div className="mx-auto grid max-w-[430px] gap-5">

                {/* Login card */}
                <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                    {/* Hero */}
                    <div className="relative h-[125px] overflow-hidden bg-[#24272a]">
                        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />

                        <div className="relative flex h-full flex-col justify-center px-6 text-white">
                            <div className="mb-2 flex items-center gap-2">
                                <img
                                    src="/logo1.jpg"
                                    alt=""
                                    className="h-6 w-6 rounded object-cover"
                                />

                                <span className="text-sm font-extrabold">
                                    ROSBOD
                                </span>
                            </div>

                            <p className="text-[10px] text-gray-200">
                                Nigeria's Industrial Marketplace
                            </p>
                        </div>
                    </div>

                    <div className="p-6 sm:p-7">

                        <h1 className="text-xl font-bold text-[#202226]">
                            Sign in to your account
                        </h1>

                        <p className="mt-1 text-xs text-gray-500">
                            Don't have an account?{" "}
                            <Link
                                href="/register"
                                className="font-medium text-[#d97706] hover:underline"
                            >
                                Register free
                            </Link>
                        </p>

                        {sessionExpired && (
                            <div className="mt-5 rounded-lg border border-orange-200 bg-orange-50 p-3">
                                <p className="text-xs font-bold text-orange-800">
                                    Your session has expired
                                </p>

                                <p className="mt-1 text-[11px] leading-4 text-orange-700">
                                    Please sign in again to continue.
                                </p>
                            </div>
                        )}

                        <form
                            onSubmit={handleLogin}
                            className="mt-6 space-y-4"
                        >

                            {/* Email */}
                            <div>
                                <label className="mb-1.5 block text-[11px] font-semibold text-[#202226]">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="you@example.com"
                                    className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#ff9900] focus:ring-2 focus:ring-orange-100"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <label className="block text-[11px] font-semibold text-[#202226]">
                                        Password
                                    </label>
                                </div>

                                <div className="relative">
                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        required
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        placeholder="••••••••"
                                        className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 pr-11 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#ff9900] focus:ring-2 focus:ring-orange-100"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? "◉" : "◌"}
                                    </button>

                                </div>
                            </div>

                            {/* Remember / forgot */}
                            <div className="flex items-center justify-between text-[10px]">
                                <label className="flex cursor-pointer items-center gap-1.5 text-gray-500">
                                    <input
                                        type="checkbox"
                                        className="h-3 w-3 accent-[#ff9900]"
                                    />
                                    Remember me
                                </label>

                                <Link
                                    href="/forgot-password"
                                    className="font-medium text-gray-500 hover:text-[#d97706]"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            {error && (
                                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                                    {error}
                                </p>
                            )}

                            {/* Login */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#ff9900] text-xs font-extrabold text-white transition hover:bg-[#e88b00] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Signing in..."
                                    : "Sign In →"}
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-3 py-1">
                                <div className="h-px flex-1 bg-gray-200" />

                                <span className="text-[10px] text-gray-400">
                                    or
                                </span>

                                <div className="h-px flex-1 bg-gray-200" />
                            </div>

                            {/* Google */}
                            {/* <button
                                type="button"
                                className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                                <span className="font-bold text-red-500">
                                    G
                                </span>

                                Continue with Google
                            </button> */}

                        </form>
                        <div className="relative my-6 text-center text-xs text-gray-400">
                            <span className="bg-white px-2">or</span>
                        </div>

                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError("Google sign-in failed")}
                                useOneTap={false}
                            />
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}