type Props = {
    brand: string;
    setBrand: (value: string) => void;

    customBrand: string;
    setCustomBrand: React.Dispatch<
        React.SetStateAction<string>
    >;

    model: string;
    setModel: (value: string) => void;

    year: string;
    setYear: (value: string) => void;

    hoursWorked: string;
    setHoursWorked: (value: string) => void;

    bucketCapacity: string;
    setBucketCapacity: (value: string) => void;

    serialNumber: string;
    setSerialNumber: (value: string) => void;

    condition: string;
    setCondition: (value: string) => void;

    locationState: string;
    setLocationState: (value: string) => void;

    city: string;
    setCity: (value: string) => void;

    mechanicalCondition: string;
    setMechanicalCondition: (value: string) => void;

    hydraulicCondition: string;
    setHydraulicCondition: (value: string) => void;
};

export default function EquipmentForm({
    model,
    setModel,
    customBrand,
    setCustomBrand,
    year,
    setYear,
    hoursWorked,
    setHoursWorked,
    mechanicalCondition,
    setMechanicalCondition,
    hydraulicCondition,
    setHydraulicCondition,
    brand,
    setBrand,
    bucketCapacity,
    setBucketCapacity,
    condition,
    setCondition,
    locationState,
    setLocationState,
    serialNumber,
    setSerialNumber,
    city,
    setCity,

}: Props) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div className="col-span-full mt-4 border-b border-gray-100 pb-3">
                <h3 className="text-sm font-extrabold text-[#24272b]">
                    Machine Information
                </h3>

                <p className="mt-1 text-[10px] text-gray-500">
                    Enter the machine brand, model, and operating details.
                </p>
            </div>

            <select
                value={brand}
                onChange={(e) => {
                    const selectedBrand = e.target.value;

                    setBrand(selectedBrand);

                    if (selectedBrand !== "Other") {
                        setCustomBrand("");
                    }
                }}
                className="
        w-full
        rounded-lg
        border
        border-gray-300
        px-3
        py-2.5
        text-sm
        outline-none
        transition
        focus:border-orange-500
        focus:ring-2
        focus:ring-orange-100
    "
            >
                <option value="">
                    Select Brand
                </option>

                <option value="Caterpillar (CAT)">
                    Caterpillar (CAT)
                </option>

                <option value="Komatsu">
                    Komatsu
                </option>

                <option value="Hyundai">
                    Hyundai
                </option>

                <option value="Hitachi">
                    Hitachi
                </option>

                <option value="Volvo">
                    Volvo
                </option>

                <option value="Doosan">
                    Doosan
                </option>

                <option value="JCB">
                    JCB
                </option>

                <option value="SANY">
                    SANY
                </option>

                <option value="XCMG">
                    XCMG
                </option>

                <option value="Liebherr">
                    Liebherr
                </option>

                <option value="Kobelco">
                    Kobelco
                </option>

                <option value="Kubota">
                    Kubota
                </option>

                <option value="Case">
                    Case
                </option>

                <option value="John Deere">
                    John Deere
                </option>

                <option value="Other">
                    Other
                </option>
            </select>
            {brand === "Other" && (
                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                        Custom Brand
                    </label>

                    <input
                        type="text"
                        placeholder="Enter the brand name"
                        value={customBrand}
                        onChange={(e) =>
                            setCustomBrand(e.target.value)
                        }
                        className="
                        w-full
                        rounded-lg
                        border
                        border-gray-300
                        px-3
                        py-2.5
                        text-sm
                        outline-none
                        transition
                        focus:border-orange-500
                        focus:ring-2
                        focus:ring-orange-100
                    "
                        required
                    />
                </div>
            )}

            <input
                type="text"
                placeholder="Model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="
                w-full
                rounded-lg
                border
                border-gray-300
                px-3
                py-2.5
                text-sm
                outline-none
                transition
                focus:border-orange-500
                focus:ring-2
                focus:ring-orange-100
            "
            />

            <input
                type="number"
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="
                w-full
                rounded-lg
                border
                border-gray-300
                px-3
                py-2.5
                text-sm
                outline-none
                transition
                focus:border-orange-500
                focus:ring-2
                focus:ring-orange-100
            "
            />

            <input
                type="number"
                placeholder="Hours Worked"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(e.target.value)}
                className="
    w-full
    rounded-lg
    border
    border-gray-300
    px-3
    py-2.5
    text-sm
    outline-none
    transition
    focus:border-orange-500
    focus:ring-2
    focus:ring-orange-100
"
            />

            <select
                value={mechanicalCondition}
                onChange={(e) => setMechanicalCondition(e.target.value)}
                className="
                w-full
                rounded-lg
                border
                border-gray-300
                px-3
                py-2.5
                text-sm
                outline-none
                transition
                focus:border-orange-500
                focus:ring-2
                focus:ring-orange-100
            "
            >
                <option value="">Mechanical Condition</option>

                <option>Excellent</option>

                <option>Good</option>

                <option>Fair</option>

                <option>Needs Repair</option>
            </select>

            <select
                value={hydraulicCondition}
                onChange={(e) => setHydraulicCondition(e.target.value)}
                className="
                w-full
                rounded-lg
                border
                border-gray-300
                px-3
                py-2.5
                text-sm
                outline-none
                transition
                focus:border-orange-500
                focus:ring-2
                focus:ring-orange-100
            "
            >
                <option value="">Hydraulic Condition</option>

                <option>Excellent</option>

                <option>Good</option>

                <option>Fair</option>

                <option>Needs Repair</option>
            </select>


            <div className="col-span-full mt-5 border-b border-gray-100 pb-3">
                <h3 className="text-sm font-extrabold text-[#24272b]">
                    Specifications
                </h3>
            </div>
            <input
                placeholder="Bucket Capacity (m³) (Excluding Machine that doesnt use Buckets)"
                value={bucketCapacity}
                onChange={(e) => setBucketCapacity(e.target.value)}
                className="
    w-full
    rounded-lg
    border
    border-gray-300
    px-3
    py-2.5
    text-sm
    outline-none
    transition
    focus:border-orange-500
    focus:ring-2
    focus:ring-orange-100
"
            />

            <input
                placeholder="Serial Number"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="
    w-full
    rounded-lg
    border
    border-gray-300
    px-3
    py-2.5
    text-sm
    outline-none
    transition
    focus:border-orange-500
    focus:ring-2
    focus:ring-orange-100
"
            />
            <div className="col-span-full mt-5 border-b border-gray-100 pb-3">
                <h3 className="text-sm font-extrabold text-[#24272b]">
                    Machine Condition
                </h3>
            </div>
            <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="
                w-full
                rounded-lg
                border
                border-gray-300
                px-3
                py-2.5
                text-sm
                outline-none
                transition
                focus:border-orange-500
                focus:ring-2
                focus:ring-orange-100
            "
            >
                <option value="">Select Condition</option>

                <option>Brand New</option>

                <option>Used</option>

                <option>Refurbished</option>

                <option>For Parts</option>
            </select>
            <div className="col-span-full mt-5 border-b border-gray-100 pb-3">
                <h3 className="text-sm font-extrabold text-[#24272b]">
                    Location
                </h3>
            </div>
            <select
                value={locationState}
                onChange={(e) => setLocationState(e.target.value)}
                className="
                w-full
                rounded-lg
                border
                border-gray-300
                px-3
                py-2.5
                text-sm
                outline-none
                transition
                focus:border-orange-500
                focus:ring-2
                focus:ring-orange-100
            "
            >
                <option value="">Select State</option>

                <option>Lagos</option>
                <option>Abuja (FCT)</option>
                <option>Ogun</option>
                <option>Oyo</option>
                <option>Ondo</option>
                <option>Osun</option>
                <option>Ekiti</option>
                <option>Kwara</option>
                <option>Kogi</option>
                <option>Edo</option>
                <option>Delta</option>
                <option>Rivers</option>
                <option>Akwa Ibom</option>
                <option>Cross River</option>
                <option>Kaduna</option>
                <option>Kano</option>
                <option>Plateau</option>
                <option>Benue</option>
                <option>Enugu</option>
                <option>Anambra</option>
                <option>Imo</option>
                <option>Abia</option>
                <option>Ebonyi</option>
                <option>Adamawa</option>
                <option>Borno</option>
                <option>Taraba</option>
                <option>Bauchi</option>
                <option>Gombe</option>
                <option>Jigawa</option>
                <option>Katsina</option>
                <option>Kebbi</option>
                <option>Nasarawa</option>
                <option>Niger</option>
                <option>Sokoto</option>
                <option>Yobe</option>
                <option>Zamfara</option>
            </select>
            <input
                placeholder="City / Town"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="
                w-full
                rounded-lg
                border
                border-gray-300
                px-3
                py-2.5
                text-sm
                outline-none
                transition
                focus:border-orange-500
                focus:ring-2
                focus:ring-orange-100
            "
            />

        </div>
    );
}