"use client";

type Props = {
    inspectionState: string;
    setInspectionState: (value: string) => void;

    inspectionCity: string;
    setInspectionCity: (value: string) => void;

    inspectionAddress: string;
    setInspectionAddress: (value: string) => void;

    inspectionDate: string;
    setInspectionDate: (value: string) => void;
};

export default function InspectionInformation({
    inspectionState,
    setInspectionState,
    inspectionCity,
    setInspectionCity,
    inspectionAddress,
    setInspectionAddress,
    inspectionDate,
    setInspectionDate,
}: Props) {
    return (
        <div className="bg-white rounded-xl shadow p-6 space-y-6">

            <h2 className="text-2xl font-bold">
                Inspection Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

                <div>
                    <label className="block mb-2 font-medium">
                        State
                    </label>

                    <input
                        type="text"
                        placeholder="Lagos"
                        value={inspectionState}
                        onChange={(e) =>
                            setInspectionState(e.target.value)
                        }
                        className="border rounded-lg p-3 w-full"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        City
                    </label>

                    <input
                        type="text"
                        placeholder="Ikeja"
                        value={inspectionCity}
                        onChange={(e) =>
                            setInspectionCity(e.target.value)
                        }
                        className="border rounded-lg p-3 w-full"
                    />
                </div>

            </div>

            <div>

                <label className="block mb-2 font-medium">
                    Inspection Address
                </label>

                <textarea
                    rows={3}
                    placeholder="Full inspection address"
                    value={inspectionAddress}
                    onChange={(e) =>
                        setInspectionAddress(e.target.value)
                    }
                    className="border rounded-lg p-3 w-full"
                />

            </div>

            <div>

                <label className="block mb-2 font-medium">
                    Inspection Date
                </label>

                <input
                    type="datetime-local"
                    value={inspectionDate}
                    onChange={(e) =>
                        setInspectionDate(e.target.value)
                    }
                    className="border rounded-lg p-3 w-full"
                />

            </div>

        </div>
    );
}