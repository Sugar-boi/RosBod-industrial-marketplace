"use client";

import { useState } from "react";

export default function RejectListingModal({
    open,
    onClose,
    onSubmit,
}: {
    open: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
}) {
    const [reason, setReason] = useState("");

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl p-6 w-[450px]">

                <h2 className="text-2xl font-bold mb-4">
                    Reject Listing
                </h2>

                <textarea
                    value={reason}
                    onChange={(e) =>
                        setReason(e.target.value)
                    }
                    rows={5}
                    className="border w-full rounded p-3"
                    placeholder="Explain why this listing was rejected..."
                />

                <div className="flex justify-end gap-3 mt-5">

                    <button
                        onClick={onClose}
                        className="border px-4 py-2 rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => {
                            if (!reason.trim()) return;

                            onSubmit(reason);
                            setReason("");
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Reject Listing
                    </button>

                </div>

            </div>

        </div>
    );
}