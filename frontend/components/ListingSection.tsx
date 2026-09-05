"use client";

import Link from "next/link";
import ListingCard from "./ListingCard";

type Props = {
    title: string;
    subtitle?: string;
    link: string;
    listings: any[];
    limit?: number;
};

export default function ListingSection({
    title,
    subtitle,
    link,
    listings,
    limit = 4,
}: Props) {

    if (!listings?.length) {
        return null;
    }

    return (
        <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">

            <div className="flex items-end justify-between gap-5 mb-8">

                <div>

                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                        {title}
                    </h2>

                    {subtitle && (
                        <p className="text-gray-500 mt-2">
                            {subtitle}
                        </p>
                    )}

                </div>

                <Link
                    href={link}
                    className="shrink-0 text-orange-600 font-semibold hover:text-orange-700"
                >
                    View All →
                </Link>

            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {listings
                    .slice(0, limit)
                    .map((listing) => (

                        <ListingCard
                            key={listing.id}
                            listing={listing}
                        />

                    ))}

            </div>

        </section>
    );
}