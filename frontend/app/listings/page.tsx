import API_BASE_URL from "@/lib/api-config";
import ListingsBrowser from "./ListingBrowser";

async function getListings() {
    try {
        const res = await fetch(
            `${API_BASE_URL}/api/listings`,
            {
                cache: "no-store",
            }
        );

        if (!res.ok) {
            throw new Error(
                "Failed to fetch listings"
            );
        }

        const data = await res.json();

        return Array.isArray(data)
            ? data
            : [];

    } catch (error) {

        console.error(
            "Failed to load listings:",
            error
        );

        return [];
    }
}

export default async function ListingsPage() {

    const listings =
        await getListings();

    return (
        <ListingsBrowser
            listings={listings}
        />
    );
}