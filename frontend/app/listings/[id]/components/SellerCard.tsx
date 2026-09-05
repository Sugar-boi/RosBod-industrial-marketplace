
import Link from "next/link";

export default function SellerCard({
    seller,
}: {
    seller: any;
}) {

    return (

        <div className="border rounded-xl p-6 mb-6">

            <h2 className="font-bold text-xl mb-3">
                Seller
            </h2>

            <p>{seller.name}</p>

            <p>{seller.location}</p>

            <div className="flex gap-3 mt-4">

                {seller.whatsapp && (

                    <a
                        href={`https://wa.me/${seller.whatsapp}`}
                        target="_blank"
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        WhatsApp
                    </a>

                )}

                <a
                    href={`mailto:${seller.email}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Email
                </a>

            </div>

            <Link
                href={`/sellers/${seller.id}`}
                className="text-blue-600 mt-4 block"
            >
                View Seller Profile →
            </Link>

        </div>

    );
}