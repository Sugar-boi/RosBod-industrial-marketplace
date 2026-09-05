"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function ImageGallery({
    images,
}: {
    images: any[];
}) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [open, setOpen] = useState(false);

    const slides = images.map((image) => ({
        src: image.imageUrl,
    }));

    return (
        <div className="mb-8">

            {/* Main Image */}

            <img
                src={images[selectedIndex]?.imageUrl}
                alt=""
                onClick={() => setOpen(true)}
                className="
                    w-full
                    h-[500px]
                    object-cover
                    rounded-xl
                    border
                    cursor-pointer
                    hover:opacity-95
                    transition
                "
            />

            {/* Thumbnails */}

            <div className="flex gap-3 mt-4 overflow-x-auto">

                {images.map((image, index) => (

                    <div className="relative">

                        <img
                            key={image.id}
                            src={image.imageUrl}
                            alt=""
                            onClick={() => setSelectedIndex(index)}
                            className={`
                            w-24
                            h-24
                            object-cover
                            rounded
                            cursor-pointer
                            border-2
                            transition
                            hover:scale-105
                            ${selectedIndex === index
                                    ? "border-orange-500"
                                    : "border-transparent"
                                }
                        `}
                        />
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded">
                            {selectedIndex + 1} / {images.length}
                        </div>

                    </div>

                ))}

            </div>

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={slides}
                index={selectedIndex}
            />

        </div>
    );
}