import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const metadata: Metadata = {
    applicationName: "Rosebod",
    title: {
        default: "Rosebod Industrial Marketplace",
        template: "%s | Rosebod",
    },
    description:
        "Buy and sell industrial equipment, property, quarry assets and spare parts in Nigeria.",
    appleWebApp: {
        capable: true,
        title: "Rosebod",
        statusBarStyle: "black-translucent",
    },
    icons: {
        icon: [
            { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
            { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
        apple: [{ url: "/icons/icon-192.png" }],
    },
};

export const viewport: Viewport = {
    themeColor: "#ff9900",
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="min-h-screen flex flex-col">
                <GoogleOAuthProvider
                    clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
                >
                    <Navbar />
                    <main className="flex-1">{children}</main>
                    <Footer />
                </GoogleOAuthProvider>
            </body>
        </html>
    );
}