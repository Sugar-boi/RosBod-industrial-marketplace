import Link from "next/link";
import API_BASE_URL from "@/lib/api-config";

async function getSeller(id: string) {
    const res = await fetch(
        `${API_BASE_URL}/api/sellers/profile/${id}`,
        {
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error(
            "Failed to fetch seller"
        );
    }

    return res.json();
}
export default async function SellerPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const seller = await getSeller(id);

    return (
        <div className="p-10">

            {/* SELLER INFO CARD */}

            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow p-8 mb-10">

                    <h1 className="text-4xl font-bold mb-2">
                        {seller.companyName || seller.name}
                    </h1>

                    <p className="text-gray-600 mb-6">
                        {seller.location}
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">

                        <div>
                            <strong>Phone:</strong>{" "}
                            {seller.phone || "Not provided"}
                        </div>

                        <div>
                            <strong>WhatsApp:</strong>{" "}
                            {seller.whatsapp || "Not provided"}
                        </div>

                        <div>
                            <strong>Member Since:</strong>{" "}
                            {new Date(
                                seller.createdAt
                            ).toLocaleDateString()}
                        </div>

                        <div>
                            <strong>Total Listings:</strong>{" "}
                            {seller.listings.length || 0}
                        </div>

                    </div>

                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-3">
                            About Company
                        </h2>

                        <p>
                            {seller.about ||
                                "No company description available."}
                        </p>
                    </div>

                    <div className="flex gap-4 mt-8">

                        {seller.whatsapp && (
                            <a
                                href={`https://wa.me/${seller.whatsapp.replace(/\D/g, "")}`}
                                target="_blank"
                                className="bg-green-600 text-white px-6 py-3 rounded-lg"
                            >
                                WhatsApp Seller
                            </a>
                        )}

                        {seller.phone && (
                            <a
                                href={`tel:${seller.phone}`}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg"
                            >
                                Call Seller
                            </a>
                        )}

                    </div>

                </div>
            </div>

            {/* LISTINGS SECTION */}

            <h2 className="text-2xl font-bold mb-6">
                Listings
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
                {seller.listings.map(
                    (listing: any) => (
                        <Link
                            key={listing.id}
                            href={`/listings/${listing.id}`}
                        >
                            <div className="border rounded-xl overflow-hidden hover:shadow-lg transition">

                                {listing.images?.[0] && (
                                    <img
                                        src={
                                            listing.images[0]
                                                .imageUrl
                                        }
                                        alt={listing.title}
                                        className="w-full h-56 object-cover"
                                    />
                                )}

                                <div className="p-4">
                                    <h3 className="font-bold text-lg">
                                        {listing.title}
                                    </h3>

                                    <p className="text-gray-500">
                                        {
                                            listing.category
                                                ?.name
                                        }
                                    </p>

                                    <p className="font-bold mt-2">
                                        $
                                        {listing.price.toLocaleString()}
                                    </p>
                                </div>

                            </div>
                        </Link>
                    )
                )}
            </div>
        </div>
    );
}