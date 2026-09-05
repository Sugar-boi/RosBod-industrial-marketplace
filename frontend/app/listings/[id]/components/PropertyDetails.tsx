export default function PropertyDetails({
    details,
}: {
    details: any;
}) {

    return (

        <div className="border rounded-xl p-6 mt-8">

            <h2 className="text-2xl font-bold mb-4">
                Property Details
            </h2>

            <p>Type: {details.propertyType}</p>

            <p>Bedrooms: {details.bedrooms}</p>

            <p>Bathrooms: {details.bathrooms}</p>

            <p>Plot Size: {details.plotSize}</p>

            <p>Title: {details.titleDocument}</p>

        </div>

    );

}