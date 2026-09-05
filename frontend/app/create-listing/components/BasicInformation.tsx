"use client";

interface Props {
    title: string;
    setTitle: (value: string) => void;

    description: string;
    setDescription: (value: string) => void;

    price: string;
    setPrice: (value: string) => void;
}

const inputClassName = `
    w-full
    rounded-lg
    border
    border-gray-300
    bg-white
    px-3
    py-2.5
    text-sm
    text-gray-900
    outline-none
    transition
    placeholder:text-gray-400
    focus:border-orange-500
    focus:ring-2
    focus:ring-orange-100
`;

export default function BasicInformation({
    title,
    setTitle,
    description,
    setDescription,
    price,
    setPrice,
}: Props) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                    Listing Title
                </label>

                <input
                    type="text"
                    placeholder="e.g. Caterpillar 320 Excavator"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={inputClassName}
                    required
                />
            </div>

            <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                    Price
                </label>

                <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
                        ₦
                    </span>

                    <input
                        type="number"
                        min="0"
                        placeholder="Enter asking price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className={`${inputClassName} pl-8`}
                        required
                    />
                </div>
            </div>

            <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                    Description
                </label>

                <textarea
                    rows={5}
                    placeholder="Describe the asset, its condition, specifications, and important details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`${inputClassName} resize-y`}
                    required
                />
            </div>
        </div>
    );
}