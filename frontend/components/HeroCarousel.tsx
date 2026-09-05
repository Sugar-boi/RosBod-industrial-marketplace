"use client";

import Link from "next/link";

import {
    Swiper,
    SwiperSlide,
} from "swiper/react";

import {
    // Autoplay,
    Pagination,
    Navigation,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

type HeroCarouselProps = {
    search: string;

    setSearch: (
        value: string
    ) => void;

    selectedCategory: string;

    setSelectedCategory: (
        value: string
    ) => void;

    selectedState: string;

    setSelectedState: (
        value: string
    ) => void;

    categories: any[];

    resultCount: number;

    onSearch: () => void;
};

export default function HeroCarousel({
    search,
    setSearch,

    selectedCategory,
    setSelectedCategory,

    selectedState,
    setSelectedState,

    categories,

    resultCount,

    onSearch,
}: HeroCarouselProps) {

    const slides = [

        {
            eyebrow:
                "Nigeria's Industrial Marketplace",

            title:
                "Buy and Sell Industrial Assets with Confidence",

            description:
                "Discover equipment, industrial property, quarry assets, spare parts and live auctions from verified sellers across Nigeria.",

            image:
                "/carousel/grok_image.jpg",

            button:
                "Browse Listings",

            link:
                "/listings",
        },

        {
            eyebrow:
                "Industrial Property",

            title:
                "Find Land, Warehouses and Industrial Facilities",

            description:
                "Explore commercial land, warehouses, factories and investment opportunities across Nigeria.",

            image:
                "/carousel/prop.jfif",

            button:
                "Browse Properties",

            link:
                "/properties",
        },

        {
            eyebrow:
                "Quarry Opportunities",

            title:
                "Discover Quarry Assets and Mining Investments",

            description:
                "Browse granite, limestone, sand, quarry operations and mining opportunities.",

            image:
                "/carousel/Gemini_Generated.png",

            button:
                "Browse Quarry",

            link:
                "/quarry",
        },

        {
            eyebrow:
                "Live Industrial Auctions",

            title:
                "Bid on Verified Industrial Assets",

            description:
                "Join live auctions, inspect assets and place competitive bids securely.",

            image:
                "/carousel/gemini.png",

            button:
                "View Auctions",

            link:
                "/auctions",
        },

    ];

    return (

        <section
            className="
                overflow-hidden
                bg-[#202226]
            "
        >

            <Swiper

                modules={[
                    // Autoplay,
                    Pagination,
                    Navigation,
                ]}

                autoplay={{
                    delay: 6000,
                    disableOnInteraction:
                        false,
                }}

                pagination={{
                    clickable: true,
                }}

                navigation

                loop

                className="
                    rosebod-hero-swiper
                "
            >

                {slides.map(
                    (slide, index) => (

                        <SwiperSlide
                            key={index}
                        >

                            <div
                                className="
                                    relative
                                    min-h-[720px]
                                    bg-cover
                                    bg-center
                                    sm:min-h-[680px]
                                    lg:min-h-[700px]
                                "
                                style={{
                                    backgroundImage:
                                        `url(${slide.image})`,
                                }}
                            >

                                {/* Dark overlay */}

                                <div
                                    className="
                                        absolute
                                        inset-0
                                        bg-gradient-to-r
                                        from-black/90
                                        via-black/70
                                        to-black/30
                                    "
                                />

                                <div
                                    className="
                                        relative
                                        z-10
                                        mx-auto
                                        flex
                                        min-h-[620px]
                                        max-w-[1440px]
                                        items-center
                                        px-5
                                        py-24
                                        sm:min-h-[680px]
                                        sm:px-8
                                        lg:px-12
                                    "
                                >

                                    <div
                                        className="
                                            max-w-3xl
                                            text-white
                                        "
                                    >

                                        <p
                                            className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-[0.22em]
                                                text-[#ff9900]
                                            "
                                        >
                                            {
                                                slide.eyebrow
                                            }
                                        </p>

                                        <h1
                                            className="
                                                mt-5
                                                max-w-3xl
                                                text-3xl
                                                font-bold
                                                leading-tight
                                                leading-[1.05]
                                                tracking-tight
                                                sm:text-5xl
                                                lg:text-6xl
                                            "
                                        >
                                            {
                                                slide.title
                                            }
                                        </h1>

                                        <p
                                            className="
                                                mt-6
                                                max-w-2xl
                                                text-base
                                                leading-7
                                                text-gray-200
                                                sm:text-lg
                                            "
                                        >
                                            {
                                                slide.description
                                            }
                                        </p>

                                        {/* Search bar */}

                                        <div
                                            className="
                                                mt-9
                                                grid
                                                overflow-hidden
                                                rounded-xl
                                                bg-white
                                                shadow-2xl
                                                sm:grid-cols-[1.5fr_0.9fr_0.9fr_auto]
                                            "
                                        >

                                            <input
                                                type="text"
                                                value={search}
                                                onChange={(e) =>
                                                    setSearch(
                                                        e.target.value
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        onSearch();
                                                    }
                                                }}
                                                placeholder="Search equipment, property, quarry assets..."
                                                className="
        min-w-0
        border-b
        border-gray-200
        px-5
        py-4
        text-sm
        text-gray-800
        outline-none
        sm:border-b-0
        sm:border-r
    "
                                            />

                                            <select
                                                value={selectedCategory}
                                                onChange={(e) =>
                                                    setSelectedCategory(
                                                        e.target.value
                                                    )
                                                }
                                                className="
        border-b
        border-gray-200
        bg-white
        px-4
        py-4
        text-sm
        text-gray-600
        outline-none
        sm:border-b-0
        sm:border-r
    "
                                            >
                                                <option value="">
                                                    All Categories
                                                </option>

                                                {categories.map(
                                                    (category: any) => (

                                                        <option
                                                            key={category.id}
                                                            value={category.id}
                                                        >
                                                            {category.name}
                                                        </option>

                                                    )
                                                )}
                                            </select>

                                            <select
                                                value={selectedState}
                                                onChange={(e) =>
                                                    setSelectedState(
                                                        e.target.value
                                                    )
                                                }
                                                className="
        border-b
        border-gray-200
        bg-white
        px-4
        py-4
        text-sm
        text-gray-600
        outline-none
        sm:border-b-0
    "
                                            >
                                                <option value="">
                                                    All Locations
                                                </option>

                                                <option value="Abia">
                                                    Abia
                                                </option>

                                                <option value="Adamawa">
                                                    Adamawa
                                                </option>

                                                <option value="Akwa Ibom">
                                                    Akwa Ibom
                                                </option>

                                                <option value="Anambra">
                                                    Anambra
                                                </option>

                                                <option value="Bauchi">
                                                    Bauchi
                                                </option>

                                                <option value="Bayelsa">
                                                    Bayelsa
                                                </option>

                                                <option value="Benue">
                                                    Benue
                                                </option>

                                                <option value="Borno">
                                                    Borno
                                                </option>

                                                <option value="Cross River">
                                                    Cross River
                                                </option>

                                                <option value="Delta">
                                                    Delta
                                                </option>

                                                <option value="Ebonyi">
                                                    Ebonyi
                                                </option>

                                                <option value="Edo">
                                                    Edo
                                                </option>

                                                <option value="Ekiti">
                                                    Ekiti
                                                </option>

                                                <option value="Enugu">
                                                    Enugu
                                                </option>

                                                <option value="Abuja (FCT)">
                                                    Abuja (FCT)
                                                </option>

                                                <option value="Gombe">
                                                    Gombe
                                                </option>

                                                <option value="Imo">
                                                    Imo
                                                </option>

                                                <option value="Jigawa">
                                                    Jigawa
                                                </option>

                                                <option value="Kaduna">
                                                    Kaduna
                                                </option>

                                                <option value="Kano">
                                                    Kano
                                                </option>

                                                <option value="Katsina">
                                                    Katsina
                                                </option>

                                                <option value="Kebbi">
                                                    Kebbi
                                                </option>

                                                <option value="Kogi">
                                                    Kogi
                                                </option>

                                                <option value="Kwara">
                                                    Kwara
                                                </option>

                                                <option value="Lagos">
                                                    Lagos
                                                </option>

                                                <option value="Nasarawa">
                                                    Nasarawa
                                                </option>

                                                <option value="Niger">
                                                    Niger
                                                </option>

                                                <option value="Ogun">
                                                    Ogun
                                                </option>

                                                <option value="Ondo">
                                                    Ondo
                                                </option>

                                                <option value="Osun">
                                                    Osun
                                                </option>

                                                <option value="Oyo">
                                                    Oyo
                                                </option>

                                                <option value="Plateau">
                                                    Plateau
                                                </option>

                                                <option value="Rivers">
                                                    Rivers
                                                </option>

                                                <option value="Sokoto">
                                                    Sokoto
                                                </option>

                                                <option value="Taraba">
                                                    Taraba
                                                </option>

                                                <option value="Yobe">
                                                    Yobe
                                                </option>

                                                <option value="Zamfara">
                                                    Zamfara
                                                </option>
                                            </select>

                                            <button
                                                type="button"
                                                onClick={onSearch}
                                                className="
        flex
        items-center
        justify-center
        bg-[#ff9900]
        px-7
        py-4
        text-sm
        font-bold
        text-[#202226]
        transition
        hover:bg-[#ffad28]
    "
                                            >
                                                Search
                                            </button>

                                        </div>

                                        {(search ||
                                            selectedCategory ||
                                            selectedState) && (

                                                <div
                                                    className="
            mt-3
            flex
            items-center
            justify-between
            text-xs
            text-white/80
        "
                                                >

                                                    <span>

                                                        {resultCount} result
                                                        {resultCount !== 1
                                                            ? "s"
                                                            : ""}{" "}
                                                        found

                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSearch("");
                                                            setSelectedCategory("");
                                                            setSelectedState("");
                                                        }}
                                                        className="
                font-semibold
                text-[#ff9900]
                hover:text-[#ffad28]
            "
                                                    >

                                                        Clear Filters

                                                    </button>

                                                </div>

                                            )}

                                        {/* Trust badges */}

                                        <div
                                            className="
                                                mt-6
                                                flex
                                                flex-wrap
                                                gap-3
                                            "
                                        >

                                            <span
                                                className="
                                                    rounded-lg
                                                    border
                                                    border-white/20
                                                    bg-black/30
                                                    px-4
                                                    py-2
                                                    text-xs
                                                    text-white
                                                    backdrop-blur
                                                "
                                            >
                                                ◈ Verified Sellers
                                            </span>

                                            <span
                                                className="
                                                    rounded-lg
                                                    border
                                                    border-white/20
                                                    bg-black/30
                                                    px-4
                                                    py-2
                                                    text-xs
                                                    text-white
                                                    backdrop-blur
                                                "
                                            >
                                                ◉ Live Auctions
                                            </span>

                                            <span
                                                className="
                                                    rounded-lg
                                                    border
                                                    border-white/20
                                                    bg-black/30
                                                    px-4
                                                    py-2
                                                    text-xs
                                                    text-white
                                                    backdrop-blur
                                                "
                                            >
                                                ✓ Admin-Reviewed Listings
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </SwiperSlide>

                    )
                )}

            </Swiper>

        </section>

    );
}