import { Suspense } from "react";
import RegisterSuccessClient from "./RegisterSuccessClient";

export default function RegisterSuccessPage() {
    return (
        <Suspense
            fallback={
                <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5] text-sm text-gray-500">
                    Loading...
                </main>
            }
        >
            <RegisterSuccessClient />
        </Suspense>
    );
}