export default function EquipmentDetails({
    details,
}: {
    details: any;
}) {

    return (

        <div className="border rounded-xl p-6 mt-8">

            <h2 className="text-2xl font-bold mb-4">
                Equipment Details
            </h2>

            <p>Manufacturer: {details.manufacturer}</p>

            <p>Model: {details.model}</p>

            <p>Year: {details.year}</p>

            <p>Hours Worked: {details.hoursWorked}</p>

            <p>
                Mechanical:
                {" "}
                {details.mechanicalCondition}
            </p>

            <p>
                Hydraulic:
                {" "}
                {details.hydraulicCondition}
            </p>

        </div>

    );

}