"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function RegisterSuccessPage() {
    const searchParams = useSearchParams();
    const role = searchParams.get("role");

    return (
        <div className="max-w-xl mx-auto p-10 text-center">
            <h1 className="text-4xl font-bold mb-6">
                Registration Successful
            </h1>

            {role === "SELLER" ? (
                <p className="text-lg mb-8">
                    Your seller account is awaiting admin approval.
                </p>
            ) : (
                <p className="text-lg mb-8">
                    Your account has been created successfully. You can now log in.
                </p>
            )}

            <Link
                href="/login"
                className="bg-black text-white px-6 py-3 rounded inline-block"
            >
                Return to Login
            </Link>
        </div>
    );
}