"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import API_BASE_URL from "@/lib/api-config";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      router.push(
        `/reset-password?email=${encodeURIComponent(email.trim())}`
      );
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-10">
      <div className="mx-auto max-w-[430px]">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-2xl">
              🔒
            </div>
            <h1 className="text-xl font-bold text-[#202226]">
              Forgot password
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Enter your email and we&apos;ll send a reset code.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-[#202226]">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#ff9900] focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center rounded-md bg-[#ff9900] text-sm font-extrabold text-white hover:bg-[#e88b00] disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send reset code"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Remembered your password?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#d97706] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}