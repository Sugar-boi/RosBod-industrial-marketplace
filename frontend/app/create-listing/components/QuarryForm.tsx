type Props = {
    quarryType: string;
    setQuarryType: (value: string) => void;

    reserveEstimate: string;
    setReserveEstimate: (value: string) => void;

    productionCapacity: string;
    setProductionCapacity: (value: string) => void;

    miningLicense: string;
    setMiningLicense: (value: string) => void;
};

export default function QuarryForm({
    quarryType,
    setQuarryType,
    reserveEstimate,
    setReserveEstimate,
    productionCapacity,
    setProductionCapacity,
    miningLicense,
    setMiningLicense,
}: Props) {
    return (
        <div className="space-y-4">

            <input
                type="text"
                placeholder="Quarry Type"
                value={quarryType}
                onChange={(e) =>
                    setQuarryType(e.target.value)
                }
                className="border p-2 w-full rounded"
            />

            <input
                type="number"
                placeholder="Reserve Estimate"
                value={reserveEstimate}
                onChange={(e) =>
                    setReserveEstimate(e.target.value)
                }
                className="border p-2 w-full rounded"
            />

            <input
                type="text"
                placeholder="Production Capacity"
                value={productionCapacity}
                onChange={(e) =>
                    setProductionCapacity(e.target.value)
                }
                className="border p-2 w-full rounded"
            />

            <input
                type="text"
                placeholder="Mining License"
                value={miningLicense}
                onChange={(e) =>
                    setMiningLicense(e.target.value)
                }
                className="border p-2 w-full rounded"
            />

        </div>
    );
}