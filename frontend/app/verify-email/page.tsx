"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import API_BASE_URL from "@/lib/api-config";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailFromQuery = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email || !code) {
      setError("Email and verification code are required.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          code: code.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Verification failed");
      }

      setMessage("Email verified successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setMessage(null);

    if (!email) {
      setError("Enter your email first.");
      return;
    }

    try {
      setResending(true);

      const res = await fetch(
        `${API_BASE_URL}/api/auth/resend-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to resend code");
      }

      setMessage("A new code has been sent to your email.");
    } catch (err: any) {
      setError(err.message || "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-10">
      <div className="mx-auto max-w-[430px]">
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="p-6 sm:p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-2xl">
                ✉️
              </div>
              <h1 className="text-xl font-bold text-[#202226]">
                Verify your email
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Enter the 6-digit code we sent to your email.
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
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

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-[#202226]">
                  Verification Code
                </label>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) =>
                    setCode(
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  placeholder="6-digit code"
                  className="h-11 w-full rounded-md border border-gray-300 px-3 text-center text-lg font-bold tracking-[0.3em] outline-none focus:border-[#ff9900] focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {error && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              {message && (
                <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center rounded-md bg-[#ff9900] text-sm font-extrabold text-white transition hover:bg-[#e88b00] disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify email"}
              </button>
            </form>

            <div className="mt-6 space-y-3 text-center text-sm">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="font-semibold text-[#d97706] hover:underline disabled:opacity-60"
              >
                {resending
                  ? "Sending..."
                  : "Resend code"}
              </button>

              <p className="text-gray-500">
                Already verified?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#d97706] hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-gray-500">
          Loading...
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}