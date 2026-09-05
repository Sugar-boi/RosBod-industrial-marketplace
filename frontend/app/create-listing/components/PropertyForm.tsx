"use client";

type Props = {
    propertyCategory: string;

    plotSize: string;
    setPlotSize: (v: string) => void;

    plotUnit: string;
    setPlotUnit: (v: string) => void;

    bedrooms: string;
    setBedrooms: (v: string) => void;

    bathrooms: string;
    setBathrooms: (v: string) => void;

    floors: string;
    setFloors: (v: string) => void;

    parkingSpaces: string;
    setParkingSpaces: (v: string) => void;

    warehouseSize: string;
    setWarehouseSize: (v: string) => void;

    factorySize: string;
    setFactorySize: (v: string) => void;

    powerSupply: string;
    setPowerSupply: (v: string) => void;

    officeSpace: boolean;
    setOfficeSpace: (v: boolean) => void;

    titleDocument: string;
    setTitleDocument: (v: string) => void;

    roadAccess: boolean;
    setRoadAccess: (v: boolean) => void;

    propertyState: string;
    setPropertyState: (v: string) => void;

    propertyCity: string;
    setPropertyCity: (v: string) => void;

    address: string;
    setAddress: (v: string) => void;
};

export default function PropertyForm(props: Props) {

    const land =
        ["Residential Land", "Commercial Land", "Industrial Land", "Farm Land"]
            .includes(props.propertyCategory);

    const house =
        ["House", "Duplex", "Apartments"]
            .includes(props.propertyCategory);

    const warehouse =
        props.propertyCategory === "Warehouse";

    const factory =
        props.propertyCategory === "Factory";

    return (

        <div className="space-y-4">

            {(land || factory) && (
                <>
                    <input
                        placeholder="Plot Size"
                        value={props.plotSize}
                        onChange={(e) => props.setPlotSize(e.target.value)}
                        className="border p-2 w-full rounded"
                    />

                    <select
                        value={props.plotUnit}
                        onChange={(e) => props.setPlotUnit(e.target.value)}
                        className="border p-2 w-full rounded"
                    >
                        <option value="">Unit</option>
                        <option>Square Meters</option>
                        <option>Acres</option>
                        <option>Hectares</option>
                    </select>
                </>
            )}

            {house && (
                <>
                    <input
                        placeholder="Bedrooms"
                        value={props.bedrooms}
                        onChange={(e) => props.setBedrooms(e.target.value)}
                        className="border p-2 w-full rounded"
                    />

                    <input
                        placeholder="Bathrooms"
                        value={props.bathrooms}
                        onChange={(e) => props.setBathrooms(e.target.value)}
                        className="border p-2 w-full rounded"
                    />

                    <input
                        placeholder="Floors"
                        value={props.floors}
                        onChange={(e) => props.setFloors(e.target.value)}
                        className="border p-2 w-full rounded"
                    />

                    <input
                        placeholder="Parking Spaces"
                        value={props.parkingSpaces}
                        onChange={(e) => props.setParkingSpaces(e.target.value)}
                        className="border p-2 w-full rounded"
                    />
                </>
            )}

            {warehouse && (
                <>
                    <input
                        placeholder="Warehouse Size"
                        value={props.warehouseSize}
                        onChange={(e) => props.setWarehouseSize(e.target.value)}
                        className="border p-2 w-full rounded"
                    />

                    <input
                        placeholder="Power Supply"
                        value={props.powerSupply}
                        onChange={(e) => props.setPowerSupply(e.target.value)}
                        className="border p-2 w-full rounded"
                    />

                    <label className="flex gap-2">
                        <input
                            type="checkbox"
                            checked={props.officeSpace}
                            onChange={(e) =>
                                props.setOfficeSpace(e.target.checked)
                            }
                        />
                        Office Space Available
                    </label>
                </>
            )}

            {factory && (
                <>
                    <input
                        placeholder="Factory Size"
                        value={props.factorySize}
                        onChange={(e) => props.setFactorySize(e.target.value)}
                        className="border p-2 w-full rounded"
                    />

                    <input
                        placeholder="Power Supply"
                        value={props.powerSupply}
                        onChange={(e) => props.setPowerSupply(e.target.value)}
                        className="border p-2 w-full rounded"
                    />
                </>
            )}

            <input
                placeholder="Title Document"
                value={props.titleDocument}
                onChange={(e) => props.setTitleDocument(e.target.value)}
                className="border p-2 w-full rounded"
            />

            <label className="flex gap-2">
                <input
                    type="checkbox"
                    checked={props.roadAccess}
                    onChange={(e) =>
                        props.setRoadAccess(e.target.checked)
                    }
                />
                Road Access
            </label>

            <input
                placeholder="State"
                value={props.propertyState}
                onChange={(e) =>
                    props.setPropertyState(e.target.value)
                }
                className="border p-2 w-full rounded"
            />

            <input
                placeholder="City"
                value={props.propertyCity}
                onChange={(e) =>
                    props.setPropertyCity(e.target.value)
                }
                className="border p-2 w-full rounded"
            />

            <input
                placeholder="Address (optional)"
                value={props.address}
                onChange={(e) =>
                    props.setAddress(e.target.value)
                }
                className="border p-2 w-full rounded"
            />

        </div>

    );
}