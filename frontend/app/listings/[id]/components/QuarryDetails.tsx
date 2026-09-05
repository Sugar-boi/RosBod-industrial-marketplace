export default function QuarryDetails({
    details,
}: {
    details: any;
}) {

    return (

        <div className="border rounded-xl p-6 mt-8">

            <h2 className="text-2xl font-bold mb-4">
                Quarry Details
            </h2>

            <p>Type: {details.quarryType}</p>

            <p>Reserve: {details.reserveEstimate}</p>

            <p>
                Production:
                {" "}
                {details.productionCapacity}
            </p>

            <p>License: {details.miningLicense}</p>

        </div>

    );

}