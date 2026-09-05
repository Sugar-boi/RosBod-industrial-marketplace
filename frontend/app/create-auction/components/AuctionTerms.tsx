"use client";

type Props = {
    paymentTerms: string;
    setPaymentTerms: (value: string) => void;

    terms: string;
    setTerms: (value: string) => void;
};

export default function AuctionTerms({
    paymentTerms,
    setPaymentTerms,

    terms,
    setTerms,
}: Props) {
    return (
        <div className="bg-white rounded-xl shadow p-6 space-y-6">

            <h2 className="text-2xl font-bold">
                Payment & Terms
            </h2>

            <div>

                <label className="block mb-2 font-medium">
                    Payment Terms
                </label>

                <textarea
                    rows={4}
                    placeholder="Example: Full payment must be made within 5 business days after the auction ends."
                    value={paymentTerms}
                    onChange={(e) =>
                        setPaymentTerms(e.target.value)
                    }
                    className="border rounded-lg p-3 w-full"
                />

            </div>

            <div>

                <label className="block mb-2 font-medium">
                    Terms & Conditions
                </label>

                <textarea
                    rows={6}
                    placeholder="Example: Item is sold as-is where-is. Inspection is recommended before bidding. Buyer is responsible for transportation."
                    value={terms}
                    onChange={(e) =>
                        setTerms(e.target.value)
                    }
                    className="border rounded-lg p-3 w-full"
                />

            </div>

        </div>
    );
}