export default function ListingInfo({
    listing,
}: {
    listing: any;
}) {

    return (

        <>

            <p className="mb-6">

                {listing.description}

            </p>

            <h2 className="text-3xl font-bold mb-4">

                $

                {listing.price.toLocaleString()}

            </h2>

            <p>

                Category:

                {" "}

                {listing.category.name}

            </p>

            <p>

                {listing.isAuction

                    ? "🔨 Auction"

                    : "🛒 Buy Now"}

            </p>

        </>

    );

}