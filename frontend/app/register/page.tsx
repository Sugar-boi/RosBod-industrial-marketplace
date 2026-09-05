"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import API_BASE_URL from "@/lib/api-config";
import { GoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("BUYER");
    const [phone, setPhone] = useState("");
    const [whatsapp, setWhatsapp] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            setLoading(true);

            const res = await fetch(
                `${API_BASE_URL}/api/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        role,
                        phone,
                        whatsapp,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setError(
                    data.message ||
                    "Registration failed"
                );
                return;
            }

            setSuccess("Registration successful. Please verify your email.");

            router.push(
                `/verify-email?email=${encodeURIComponent(email)}`
            );

            setName("");
            setEmail("");
            setPassword("");
            setPhone("");
            setWhatsapp("");
        } catch (error) {
            console.error(error);
            setError(
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };
    const handleGoogleSuccess = async (response: any) => {
        setError(null);
        setSuccess(null);

        try {
            setLoading(true);

            const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    credential: response.credential,
                    role, // "BUYER" or "SELLER" from your toggle
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Google sign-up failed");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            window.dispatchEvent(new Event("authChanged"));

            // Google users are already email-verified
            if (data.user.role === "ADMIN") {
                router.push("/admin");
            } else {
                router.push("/dashboard");
            }
        } catch {
            setError("Google sign-up failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f7f7f5] px-4 py-8 sm:px-6 lg:px-10">

            <div className="mx-auto grid max-w-[430px]">

                <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                    {/* Hero */}
                    <div className="relative h-[125px] overflow-hidden bg-[#292b2d]">
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />

                        <div className="relative flex h-full flex-col justify-center px-6 text-white">

                            <h1 className="text-base font-extrabold">
                                Join Nigeria's Industrial Marketplace
                            </h1>

                            <p className="mt-1 text-[10px] text-gray-200">
                                Buy, sell, and auction industrial assets
                            </p>

                        </div>
                    </div>

                    <div className="p-6 sm:p-7">

                        <div className="flex items-center justify-between">

                            <div>
                                <h2 className="text-xl font-bold text-[#202226]">
                                    Create an account
                                </h2>

                                <p className="mt-1 text-xs text-gray-500">
                                    Already registered?{" "}
                                    <Link
                                        href="/login"
                                        className="font-medium text-[#d97706] hover:underline"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-6 space-y-4"
                        >

                            {/* Role */}
                            <div>
                                <label className="mb-2 block text-[11px] font-semibold text-[#202226]">
                                    I want to...
                                </label>

                                <div className="grid grid-cols-2 gap-2">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setRole("BUYER")
                                        }
                                        className={`rounded-md border p-3 text-left transition ${role === "BUYER"
                                            ? "border-[#ff9900] bg-orange-50"
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                            }`}
                                    >
                                        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-white text-[#ff9900] shadow-sm">
                                            🔍
                                        </div>

                                        <p className="text-[11px] font-bold text-[#202226]">
                                            Buy Assets
                                        </p>

                                        <p className="mt-0.5 text-[9px] text-gray-500">
                                            Browse & bid
                                        </p>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setRole("SELLER")
                                        }
                                        className={`rounded-md border p-3 text-left transition ${role === "SELLER"
                                            ? "border-[#ff9900] bg-orange-50"
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                            }`}
                                    >
                                        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-white text-[#ff9900] shadow-sm">
                                            🏷
                                        </div>

                                        <p className="text-[11px] font-bold text-[#202226]">
                                            Sell Assets
                                        </p>

                                        <p className="mt-0.5 text-[9px] text-gray-500">
                                            List & auction
                                        </p>
                                    </button>

                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="mb-1.5 block text-[11px] font-semibold text-[#202226]">
                                    Full Name{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) =>
                                        setName(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Your full name"
                                    className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#ff9900] focus:ring-2 focus:ring-orange-100"
                                />
                            </div>

                            {/* Company for seller */}
                            {role === "SELLER" && (
                                <>
                                    <div>
                                        <label className="mb-1.5 block text-[11px] font-semibold text-[#202226]">
                                            Company Name
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Optional — for businesses"
                                            className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#ff9900] focus:ring-2 focus:ring-orange-100"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="mb-1.5 block text-[11px] font-semibold text-[#202226]">
                                                Phone
                                            </label>

                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) =>
                                                    setPhone(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="+234..."
                                                className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#ff9900] focus:ring-2 focus:ring-orange-100"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1.5 block text-[11px] font-semibold text-[#202226]">
                                                WhatsApp
                                            </label>

                                            <input
                                                type="tel"
                                                value={whatsapp}
                                                onChange={(e) =>
                                                    setWhatsapp(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="+234..."
                                                className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#ff9900] focus:ring-2 focus:ring-orange-100"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Email */}
                            <div>
                                <label className="mb-1.5 block text-[11px] font-semibold text-[#202226]">
                                    Email Address{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    placeholder="you@example.com"
                                    className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#ff9900] focus:ring-2 focus:ring-orange-100"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="mb-1.5 block text-[11px] font-semibold text-[#202226]">
                                    Password{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <div className="relative">
                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        required
                                        minLength={8}
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Min. 8 characters"
                                        className="h-11 w-full rounded-md border border-gray-300 px-3 pr-11 text-sm outline-none placeholder:text-gray-400 focus:border-[#ff9900] focus:ring-2 focus:ring-orange-100"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    >
                                        {showPassword
                                            ? "◉"
                                            : "◌"}
                                    </button>
                                </div>

                                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[9px]">
                                    <span className="text-green-600">
                                        ● 8+ characters
                                    </span>

                                    <span className="text-gray-400">
                                        ● Uppercase letter
                                    </span>

                                    <span className="text-gray-400">
                                        ● Number
                                    </span>

                                    <span className="text-gray-400">
                                        ● Special character
                                    </span>
                                </div>
                            </div>

                            {/* Terms */}
                            <label className="flex items-start gap-2 text-[9px] leading-4 text-gray-500">
                                <input
                                    type="checkbox"
                                    required
                                    className="mt-0.5 h-3 w-3 accent-[#ff9900]"
                                />

                                <span>
                                    I agree to the{" "}
                                    <span className="font-medium">
                                        Terms of Service
                                    </span>{" "}
                                    and{" "}
                                    <span className="font-medium">
                                        Privacy Policy
                                    </span>
                                </span>
                            </label>

                            {error && (
                                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                                    {error}
                                </p>
                            )}

                            {success && (
                                <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
                                    {success}
                                </p>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex h-11 w-full items-center justify-center rounded-md bg-[#ff9900] text-xs font-extrabold text-white transition hover:bg-[#e88b00] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Creating Account..."
                                    : "Create Account →"}
                            </button>

                            <div className="mt-4 flex items-center gap-3">
                                <div className="h-px flex-1 bg-gray-200" />
                                <span className="text-[10px] text-gray-400">or</span>
                                <div className="h-px flex-1 bg-gray-200" />
                            </div>

                            <p className="mt-3 text-center text-[10px] text-gray-500">
                                Continue with Google as{" "}
                                <span className="font-semibold text-[#202226]">
                                    {role === "SELLER" ? "Seller" : "Buyer"}
                                </span>
                                {role === "SELLER" && (
                                    <span className="block mt-1">
                                        Seller accounts still need admin approval before listing.
                                    </span>
                                )}
                            </p>

                            <div className="mt-3 flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError("Google sign-up failed")}
                                    useOneTap={false}
                                    text="signup_with"
                                />
                            </div>

                        </form>
                    </div>
                </section>

            </div>
        </main>
    );
}