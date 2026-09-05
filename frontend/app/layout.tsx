import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="min-h-screen flex flex-col">
                <GoogleOAuthProvider
                    clientId={
                        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""
                    }
                >
                    <Navbar />

                    <main className="flex-1">
                        {children}
                    </main>

                    <Footer />
                </GoogleOAuthProvider>
            </body>
        </html>
    );
}