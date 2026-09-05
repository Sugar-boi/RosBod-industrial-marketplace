"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API_BASE_URL from "@/lib/api-config";
import BasicInformation from "@/app/create-listing/components/BasicInformation";
import CategorySelector from "@/app/create-listing/components/CategorySelector";
import ImageUploader from "@/app/create-listing/components/ImageUploader";
import EquipmentForm from "@/app/create-listing/components/EquipmentForm";
import PropertyForm from "@/app/create-listing/components/PropertyForm";
import QuarryForm from "@/app/create-listing/components/QuarryForm";
import Link from "next/link";
// import RejectListingModal from "@/components/RejectListingModal";

export default function EditListingPage() {
    const params = useParams();
    const router = useRouter();
    type Category = {
        id: number;
        name: string;
        parentId: number | null;
    };
    // const [showRejectModal, setShowRejectModal] =
    // useState(false);
    const [categories, setCategories] =
        useState<Category[]>([]);
    const [saving, setSaving] = useState(false);

    const id = Array.isArray(params.id)
        ? params.id[0]
        : params.id;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const [categoryId, setCategoryId] = useState("");
    const [parentCategoryId, setParentCategoryId] = useState("");

    const [isAuction, setIsAuction] = useState(false);

    const [brand, setBrand] = useState("");

    const [customBrand, setCustomBrand] = useState("");

    const [model, setModel] = useState("");

    const [year, setYear] = useState("");

    const [hoursWorked, setHoursWorked] = useState("");

    const [bucketCapacity, setBucketCapacity] = useState("");

    const [serialNumber, setSerialNumber] = useState("");

    const [condition, setCondition] = useState("");

    const [locationState, setLocationState] = useState("");

    const [city, setCity] = useState("");

    const [mechanicalCondition, setMechanicalCondition] = useState("");

    const [hydraulicCondition, setHydraulicCondition] = useState("");

    const [plotSize, setPlotSize] = useState("");
    const [plotUnit, setPlotUnit] = useState("");

    const [bedrooms, setBedrooms] = useState("");

    const [bathrooms, setBathrooms] = useState("");

    const [floors, setFloors] = useState("");

    const [parkingSpaces, setParkingSpaces] = useState("");

    const [warehouseSize, setWarehouseSize] = useState("");
    const [listingStatus, setListingStatus] = useState("");
    const [rejectReason, setRejectReason] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);

    const [
        factorySize,
        setFactorySize
    ] = useState("");

    const [
        powerSupply,
        setPowerSupply
    ] = useState("");

    const [
        officeSpace,
        setOfficeSpace
    ] = useState(false);

    const [
        titleDocument,
        setTitleDocument
    ] = useState("");

    const [
        roadAccess,
        setRoadAccess
    ] = useState(false);

    const [
        propertyState,
        setPropertyState
    ] = useState("");

    const [
        propertyCity,
        setPropertyCity
    ] = useState("");

    const [address, setAddress] =
        useState("");

    const [quarryType, setQuarryType] = useState("");
    const [reserveEstimate, setReserveEstimate] = useState("");
    const [
        productionCapacity,
        setProductionCapacity
    ] = useState("");

    const [
        miningLicense,
        setMiningLicense
    ] = useState("");



    const [loading, setLoading] =
        useState(true);

    const predefinedBrands = [
        "Caterpillar (CAT)",
        "Komatsu",
        "Hyundai",
        "Hitachi",
        "Volvo",
        "Doosan",
        "JCB",
        "SANY",
        "XCMG",
        "Liebherr",
        "Kobelco",
        "Kubota",
        "Case",
        "John Deere",
    ];

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const token =
                    localStorage.getItem("token");

                const res = await fetch(
                    `${API_BASE_URL}/api/sellers/my-listings/${id}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) {
                    setFormError("Failed to load listing");
                    return;
                }

                const categoriesRes =
                    await fetch(
                        `${API_BASE_URL}/api/categories`
                    );

                const categoriesData =
                    await categoriesRes.json();

                setCategories(
                    categoriesData
                );


                const data = await res.json();

                setListingStatus(data.status || "");
                setRejectReason(data.rejectReason || "");

                setTitle(data.title || "");
                setDescription(data.description || "");
                setPrice(String(data.price ?? ""));
                setCategoryId(String(data.categoryId || ""));
                setIsAuction(!!data.isAuction);

                // FIX: backend sends listingimage, not images
                const rawImages = data.images || data.listingimage || [];
                setImageUrls(
                    rawImages
                        .map((img: any) =>
                            typeof img === "string" ? img : img?.imageUrl
                        )
                        .filter(Boolean)
                );

                if (data.equipmentDetails) {
                    const equipment = data.equipmentDetails;
                    const savedBrand = equipment.brand || "";

                    if (predefinedBrands.includes(savedBrand)) {
                        setBrand(savedBrand);
                        setCustomBrand("");
                    } else if (savedBrand) {
                        setBrand("Other");
                        setCustomBrand(savedBrand);
                    } else {
                        setBrand("");
                        setCustomBrand("");
                    }

                    setModel(equipment.model || "");
                    setYear(
                        equipment.year != null ? String(equipment.year) : ""
                    );
                    setHoursWorked(
                        equipment.operatingHours != null
                            ? String(equipment.operatingHours)
                            : ""
                    );
                    setBucketCapacity(equipment.bucketCapacity || "");
                    setSerialNumber(equipment.serialNumber || "");
                    setCondition(equipment.condition || "");
                    setLocationState(equipment.state || "");
                    setCity(equipment.city || "");
                    setMechanicalCondition(
                        equipment.mechanicalCondition || ""
                    );
                    setHydraulicCondition(
                        equipment.hydraulicCondition || ""
                    );
                }

                if (data.propertyDetails) {
                    const property = data.propertyDetails;
                    setPlotSize(
                        property.plotSize != null
                            ? String(property.plotSize)
                            : ""
                    );
                    setPlotUnit(property.plotUnit || "");
                    setBedrooms(
                        property.bedrooms != null
                            ? String(property.bedrooms)
                            : ""
                    );
                    setBathrooms(
                        property.bathrooms != null
                            ? String(property.bathrooms)
                            : ""
                    );
                    setFloors(
                        property.floors != null
                            ? String(property.floors)
                            : ""
                    );
                    setParkingSpaces(
                        property.parkingSpaces != null
                            ? String(property.parkingSpaces)
                            : ""
                    );
                    setWarehouseSize(
                        property.warehouseSize != null
                            ? String(property.warehouseSize)
                            : ""
                    );
                    setFactorySize(
                        property.factorySize != null
                            ? String(property.factorySize)
                            : ""
                    );
                    setPowerSupply(property.powerSupply || "");
                    setOfficeSpace(property.officeSpace === true);
                    setTitleDocument(property.titleDocument || "");
                    setRoadAccess(property.roadAccess === true);
                    setPropertyState(property.state || "");
                    setPropertyCity(property.city || "");
                    setAddress(property.address || "");
                }

                if (data.quarryDetails) {
                    const quarry = data.quarryDetails;
                    setQuarryType(quarry.quarryType || "");
                    setReserveEstimate(
                        quarry.reserveEstimate != null
                            ? String(quarry.reserveEstimate)
                            : ""
                    );
                    setProductionCapacity(
                        quarry.productionCapacity != null
                            ? String(quarry.productionCapacity)
                            : ""
                    );
                    setMiningLicense(quarry.miningLicense || "");
                }

                // categories may be array or { categories: [] }
                const cats = Array.isArray(categoriesData)
                    ? categoriesData
                    : categoriesData?.categories || [];
                setCategories(cats);

                const currentCategory = cats.find(
                    (c: any) => c.id === data.categoryId
                );
                if (currentCategory?.parentId) {
                    setParentCategoryId(
                        String(currentCategory.parentId)
                    );
                }
            } catch (error) {
                console.error(error);
                setFormError("Failed to load listing");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchListing();
        }
    }, [id]);



    const renderExtraFields = () => {

        const selectedCategory =
            categories.find(
                (category) =>
                    category.id ===
                    Number(categoryId)
            );

        const parentCategory =
            categories.find(
                (category) =>
                    category.id ===
                    selectedCategory?.parentId
            );

        const parentName =
            parentCategory?.name
                ?.trim()
                .toLowerCase();

        const categoryName =
            selectedCategory?.name || "";

        if (
            parentName === "equipment"
        ) {
            return (

                <EquipmentForm

                    brand={brand}
                    setBrand={setBrand}

                    customBrand={customBrand}
                    setCustomBrand={setCustomBrand}

                    model={model}
                    setModel={setModel}

                    year={year}
                    setYear={setYear}

                    hoursWorked={hoursWorked}
                    setHoursWorked={
                        setHoursWorked
                    }

                    bucketCapacity={
                        bucketCapacity
                    }
                    setBucketCapacity={
                        setBucketCapacity
                    }

                    serialNumber={
                        serialNumber
                    }
                    setSerialNumber={
                        setSerialNumber
                    }

                    condition={condition}
                    setCondition={
                        setCondition
                    }

                    locationState={
                        locationState
                    }
                    setLocationState={
                        setLocationState
                    }

                    city={city}
                    setCity={setCity}

                    mechanicalCondition={
                        mechanicalCondition
                    }
                    setMechanicalCondition={
                        setMechanicalCondition
                    }

                    hydraulicCondition={
                        hydraulicCondition
                    }
                    setHydraulicCondition={
                        setHydraulicCondition
                    }

                />

            );
        }


        if (
            parentName === "properties" ||
            parentName === "property"
        ) {
            return (

                <PropertyForm

                    propertyCategory={
                        categoryName
                    }

                    plotSize={plotSize}
                    setPlotSize={
                        setPlotSize
                    }

                    plotUnit={plotUnit}
                    setPlotUnit={
                        setPlotUnit
                    }

                    bedrooms={bedrooms}
                    setBedrooms={
                        setBedrooms
                    }

                    bathrooms={bathrooms}
                    setBathrooms={
                        setBathrooms
                    }

                    floors={floors}
                    setFloors={
                        setFloors
                    }

                    parkingSpaces={
                        parkingSpaces
                    }
                    setParkingSpaces={
                        setParkingSpaces
                    }

                    warehouseSize={
                        warehouseSize
                    }
                    setWarehouseSize={
                        setWarehouseSize
                    }

                    factorySize={
                        factorySize
                    }
                    setFactorySize={
                        setFactorySize
                    }

                    powerSupply={
                        powerSupply
                    }
                    setPowerSupply={
                        setPowerSupply
                    }

                    officeSpace={
                        officeSpace
                    }
                    setOfficeSpace={
                        setOfficeSpace
                    }

                    titleDocument={
                        titleDocument
                    }
                    setTitleDocument={
                        setTitleDocument
                    }

                    roadAccess={
                        roadAccess
                    }
                    setRoadAccess={
                        setRoadAccess
                    }

                    propertyState={
                        propertyState
                    }
                    setPropertyState={
                        setPropertyState
                    }

                    propertyCity={
                        propertyCity
                    }
                    setPropertyCity={
                        setPropertyCity
                    }

                    address={address}
                    setAddress={
                        setAddress
                    }

                />

            );
        }


        if (
            parentName === "quarry"
        ) {
            return (

                <QuarryForm

                    quarryType={
                        quarryType
                    }
                    setQuarryType={
                        setQuarryType
                    }

                    reserveEstimate={
                        reserveEstimate
                    }
                    setReserveEstimate={
                        setReserveEstimate
                    }

                    productionCapacity={
                        productionCapacity
                    }
                    setProductionCapacity={
                        setProductionCapacity
                    }

                    miningLicense={
                        miningLicense
                    }
                    setMiningLicense={
                        setMiningLicense
                    }

                />

            );
        }

        return null;
    };



    const saveChanges = async () => {
        setSaving(true);
        setFormError(null);
        setFormSuccess(null);

        try {
            const token =
                localStorage.getItem("token");

            if (!token) {
                setFormError("Please log in again.");
                setSaving(false);
                return;
            }

            const res = await fetch(
                `${API_BASE_URL}/api/sellers/my-listings/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: JSON.stringify({

                        // =========================
                        // BASIC INFORMATION
                        // =========================

                        title,
                        description,

                        price: price
                            ? Number(price)
                            : 0,

                        categoryId:
                            Number(categoryId),

                        images: imageUrls,

                        isAuction,


                        // =========================
                        // EQUIPMENT
                        // =========================

                        brand: brand === "Other"
                            ? customBrand
                            : brand,
                        model,

                        year: year
                            ? Number(year)
                            : null,

                        hoursWorked:
                            hoursWorked
                                ? Number(hoursWorked)
                                : null,

                        bucketCapacity,

                        serialNumber,

                        condition,

                        locationState,

                        city,

                        mechanicalCondition,

                        hydraulicCondition,


                        // =========================
                        // PROPERTY
                        // =========================

                        plotSize:
                            plotSize
                                ? Number(plotSize)
                                : null,

                        plotUnit,

                        bedrooms:
                            bedrooms
                                ? Number(bedrooms)
                                : null,

                        bathrooms:
                            bathrooms
                                ? Number(bathrooms)
                                : null,

                        floors:
                            floors
                                ? Number(floors)
                                : null,

                        parkingSpaces:
                            parkingSpaces
                                ? Number(parkingSpaces)
                                : null,

                        warehouseSize:
                            warehouseSize
                                ? Number(warehouseSize)
                                : null,

                        factorySize:
                            factorySize
                                ? Number(factorySize)
                                : null,

                        powerSupply,

                        officeSpace,

                        titleDocument,

                        roadAccess,

                        propertyState,

                        propertyCity,

                        address,


                        // =========================
                        // QUARRY
                        // =========================

                        quarryType,

                        reserveEstimate: reserveEstimate
                            ? Number(reserveEstimate)
                            : null,

                        productionCapacity,

                        miningLicense,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update listing"
                );
            }

            setFormSuccess(
                listingStatus === "REJECTED"
                    ? "Listing updated and resubmitted for administrator approval."
                    : "Listing updated successfully."
            );

            setTimeout(() => {
                router.push("/dashboard/my-listings");
            }, 1200);

            router.push(
                "/dashboard/my-listings"
            );

        } catch (error: any) {
            console.error("Failed to save listing:", error);
            setFormError(error.message || "Failed to update listing.");
        } finally {
            setSaving(false);
        }
    };

    const extraFields = renderExtraFields();
    if (loading) {
        return (
            <div className="p-10">
                Loading...
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-[#f7f7f8]">

            {/* PAGE HEADER */}

            <div className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-6xl px-6 py-5">

                    <div className="flex items-center justify-between gap-4">

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                My Listings
                            </p>

                            <h1 className="mt-1 text-2xl font-bold text-[#24272b]">
                                Edit Listing
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Update your listing information and resubmit it for review.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    `/dashboard/my-listings/${id}`
                                )
                            }
                            disabled={saving}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                        >
                            Discard & Exit
                        </button>

                    </div>

                </div>
            </div>


            {/* CONTENT */}

            <main className="mx-auto max-w-6xl px-6 py-8">

                {/* BREADCRUMB */}


                <div className="mb-6 text-sm text-gray-500">
                    <Link
                        href="/dashboard/my-listings"
                        className="hover:text-gray-900"
                    >
                        My Listings
                    </Link>

                    <span className="mx-2">/</span>

                    <span className="text-gray-900">
                        {title || "Edit Listing"}
                    </span>
                </div>


                {/* REJECTION NOTICE */}

                {/* This only appears for rejected listings */}{listingStatus === "REJECTED" && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5">

                        <div className="flex gap-3">

                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">
                                !
                            </div>

                            <div>

                                <h2 className="font-semibold text-red-900">
                                    Listing Rejected
                                </h2>

                                <p className="mt-1 text-sm leading-6 text-red-700">
                                    Your listing was rejected by an administrator.
                                    Please review the reason below, make the required
                                    changes, and save your listing to resubmit it.
                                </p>

                                {rejectReason && (
                                    <div className="mt-3 rounded-lg border border-red-200 bg-white p-3">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-red-500">
                                            Rejection Reason
                                        </p>

                                        <p className="mt-1 text-sm text-gray-700">
                                            {rejectReason}
                                        </p>
                                    </div>
                                )}

                            </div>

                        </div>

                    </div>
                )}


                {/*
                You can enable this once the listing response
                is stored in state as `listingStatus` and
                `rejectReason`.
                */}


                {/* REVIEW NOTICE */}

                <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 p-5">

                    <div className="flex gap-3">

                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                            !
                        </div>

                        <div>

                            <h2 className="font-semibold text-gray-900">
                                Changes require administrator review
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                After you save your changes, this listing
                                will be submitted for administrator review.
                                It may not be publicly visible until the
                                review has been completed.
                            </p>

                        </div>

                    </div>

                </div>
                {formError && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {formError}
                    </div>
                )}

                {formSuccess && (
                    <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {formSuccess}
                    </div>
                )}


                <div className="space-y-6">


                    {/* BASIC INFORMATION */}

                    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">

                        <div className="border-b border-gray-100 px-6 py-5">

                            <h2 className="text-lg font-bold text-[#24272b]">
                                Basic Information
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Update the main information buyers will see.
                            </p>

                        </div>

                        <div className="px-6 py-6">

                            <BasicInformation
                                title={title}
                                setTitle={setTitle}

                                description={description}
                                setDescription={setDescription}

                                price={price}
                                setPrice={setPrice}
                            />

                        </div>

                    </section>


                    {/* CATEGORY */}

                    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">

                        <div className="border-b border-gray-100 px-6 py-5">

                            <h2 className="text-lg font-bold text-[#24272b]">
                                Category
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Choose the category that best describes this listing.
                            </p>

                        </div>

                        <div className="px-6 py-6">

                            <CategorySelector
                                categories={categories}

                                parentCategoryId={
                                    parentCategoryId
                                }

                                setParentCategoryId={
                                    setParentCategoryId
                                }

                                categoryId={categoryId}

                                setCategoryId={
                                    setCategoryId
                                }
                            />

                        </div>

                    </section>


                    {/* CATEGORY-SPECIFIC DETAILS */}

                    {extraFields && (
                        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">

                            <div className="border-b border-gray-100 px-6 py-5">

                                <h2 className="text-lg font-bold text-[#24272b]">
                                    Listing Details
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Update the specifications and details for this asset.
                                </p>

                            </div>

                            <div className="px-6 py-6">
                                {extraFields}
                            </div>

                        </section>
                    )}


                    {/* IMAGES */}

                    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">

                        <div className="border-b border-gray-100 px-6 py-5">

                            <h2 className="text-lg font-bold text-[#24272b]">
                                Listing Images
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Add, remove, or replace photos of your asset.
                            </p>

                        </div>

                        <div className="px-6 py-6">

                            <ImageUploader
                                imageUrls={imageUrls}
                                setImageUrls={setImageUrls}
                            />

                        </div>

                    </section>


                    {/* AUCTION NOTICE */}

                    {isAuction && (

                        <div className="rounded-xl border border-purple-200 bg-purple-50 p-5">

                            <div className="flex gap-3">

                                <div className="text-lg">
                                    🔨
                                </div>

                                <div>

                                    <p className="font-semibold text-purple-900">
                                        This is an auction listing
                                    </p>

                                    <p className="mt-1 text-sm text-purple-700">
                                        Auction settings are managed separately
                                        and cannot be changed from this page.
                                    </p>

                                </div>

                            </div>

                        </div>

                    )}


                    {/* BOTTOM ACTIONS */}

                    <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">

                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    "/dashboard/my-listings"
                                )
                            }
                            disabled={saving}
                            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>


                        <button
                            type="button"
                            onClick={saveChanges}
                            disabled={saving}
                            className="rounded-lg bg-orange-500 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving
                                ? "Submitting..."
                                : listingStatus === "REJECTED"
                                    ? "Save & Resubmit"
                                    : "Save Changes"}
                        </button>

                    </div>

                </div>

            </main>

        </div>
    );
}