"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import API_BASE_URL from "@/lib/api-config";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            code: code.trim(),
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Reset failed");
      }

      setMessage(data.message || "Password reset successfully");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setError(err.message || "Reset failed");
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
              🔑
            </div>
            <h1 className="text-xl font-bold text-[#202226]">
              Set new password
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Enter the code from your email and choose a new
              password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#ff9900]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold">
                Reset code
              </label>
              <input
                type="text"
                required
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, ""))
                }
                className="h-11 w-full rounded-md border border-gray-300 px-3 text-center text-lg font-bold tracking-[0.3em] outline-none focus:border-[#ff9900]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold">
                New password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#ff9900]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold">
                Confirm password
              </label>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#ff9900]"
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
              className="flex h-11 w-full items-center justify-center rounded-md bg-[#ff9900] text-sm font-extrabold text-white hover:bg-[#e88b00] disabled:opacity-60"
            >
              {loading ? "Saving..." : "Reset password"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            <Link
              href="/login"
              className="font-semibold text-[#d97706] hover:underline"
            >
              Back to login
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-gray-500">
          Loading...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}