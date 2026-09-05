"use client";

import {
    useEffect, useState, type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import API_BASE_URL from "@/lib/api-config";
import BasicInformation from "./components/BasicInformation";
import CategorySelector from "./components/CategorySelector";
import ImageUploader from "./components/ImageUploader";
import EquipmentForm from "./components/EquipmentForm";
import PropertyForm from "./components/PropertyForm";
import QuarryForm from "./components/QuarryForm";
// import AuctionSettings from "./components/AuctionSetting";
import SubmitButton from "./components/SubmitButton";
import SparePartForm from "@/components/SparePartForm";
import ListingProgress from "./components/ListingProgress";



export default function CreateListingPage() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [categoryId, setCategoryId] = useState("");
    const [parentCategoryId, setParentCategoryId] = useState("");
    const [categories, setCategories] = useState<any[]>([]);
    const [brand, setBrand] = useState("");
    const [customBrand, setCustomBrand] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    const [bucketCapacity, setBucketCapacity] = useState("");
    const [condition, setCondition] = useState("");
    const [locationState, setLocationState] = useState("");
    const [mechanicalCondition, setMechanicalCondition] = useState("");
    const [hydraulicCondition, setHydraulicCondition] = useState("");
    // const [state, setState] = useState("");
    const [city, setCity] = useState("");

    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [loading, setLoading] = useState(false);
    const [hoursWorked, setHoursWorked] = useState("");
    const [bedrooms, setBedrooms] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [plotSize, setPlotSize] = useState("");
    const [quarryType, setQuarryType] = useState("");
    const [reserveEstimate, setReserveEstimate] = useState("");
    const [productionCapacity, setProductionCapacity,] = useState("");
    const [miningLicense, setMiningLicense,] = useState("");
    const [quarryState, setQuarryState,] = useState("");
    const [quarryCity, setQuarryCity,] = useState("");

    const [plotUnit, setPlotUnit] = useState("");
    const [floors, setFloors] = useState("");
    const [parkingSpaces, setParkingSpaces] = useState("");
    const [warehouseSize, setWarehouseSize] = useState("");
    const [factorySize, setFactorySize] = useState("");
    const [powerSupply, setPowerSupply] = useState("");
    const [officeSpace, setOfficeSpace] = useState(false);
    const [titleDocument, setTitleDocument] = useState("");
    const [roadAccess, setRoadAccess] = useState(false);
    const [propertyState, setPropertyState] = useState("");
    const [propertyCity, setPropertyCity] = useState("");
    const [address, setAddress] = useState("");

    const [partName, setPartName] = useState("");
    const [partNumber, setPartNumber] = useState("");
    const [quantity, setQuantity] = useState("");

    const [sparePartState, setSparePartState] = useState("");
    const [sparePartCity, setSparePartCity] = useState("");
    const [user, setUser] = useState<any>(null);
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        const raw = localStorage.getItem("user");
        if (!raw || raw === "undefined") return;
        try {
            setUser(JSON.parse(raw));
        } catch {
            setUser(null);
        }
    }, []);
    const isPendingSeller =
        user?.role === "SELLER" && user?.isApproved === false;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) router.push("/login");
    }, []);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/categories`)
            .then(res => res.json())
            .then(setCategories);
    }, []);

    const selectedParent =
        Number(parentCategoryId);

    const isEquipment =
        selectedParent === 3;

    const isProperty =
        selectedParent === 1;

    const isQuarry =
        selectedParent === 2;

    const isSparePart =
        selectedParent === 4;





    const handleSubmit = async (e: any) => {
        e.preventDefault();

        setFormError(null);

        if (user?.role === "SELLER" && user?.isApproved === false) {
            setFormError(
                "Your seller account is still pending approval. You can't create listings yet."
            );
            return; // stop — do not call the API
        }

        if (!categoryId) {
            alert("Please select a sub category");
            setLoading(false);
            return;
        }
        if (
            isEquipment &&
            brand === "Other" &&
            !customBrand.trim()
        ) {
            alert(
                "Please enter the custom brand name"
            );

            return;
        }
        setLoading(true);

        try {
            const cleanNumber = (value: any) => {
                const num = Number(value);
                return isNaN(num) ? null : num;
            };
            const finalBrand =
                brand === "Other"
                    ? customBrand.trim()
                    : brand;

            const token = localStorage.getItem("token");

            const res = await fetch(`${API_BASE_URL}/api/listings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },

                body: JSON.stringify({
                    title,
                    description,
                    price: Number(price),
                    images: imageUrls,
                    categoryId: Number(categoryId),
                    // isAuction,

                    equipment: {
                        brand: finalBrand,
                        model,
                        year: cleanNumber(year),
                        operatingHours: cleanNumber(hoursWorked),
                        bucketCapacity,
                        serialNumber,
                        condition,
                        state: locationState,
                        city,
                        mechanicalCondition,
                        hydraulicCondition,
                    },
                    property: {
                        propertyType:
                            categories.find(
                                c => c.id === Number(categoryId)
                            )?.name,
                        plotSize: cleanNumber(plotSize),
                        plotUnit,
                        bedrooms: cleanNumber(bedrooms),
                        bathrooms: cleanNumber(bathrooms),
                        floors: cleanNumber(floors),
                        parkingSpaces: cleanNumber(parkingSpaces),
                        warehouseSize: cleanNumber(warehouseSize),
                        factorySize: cleanNumber(factorySize),
                        powerSupply,
                        officeSpace,
                        titleDocument,
                        roadAccess,
                        state: propertyState,
                        city: propertyCity,
                        address,
                    },
                    quarry: {
                        quarryType,
                        reserveEstimate,

                        productionCapacity,
                        miningLicense,

                        state: quarryState,
                        city: quarryCity,
                    },
                    sparePart: {
                        partName,

                        brand: finalBrand,

                        model,

                        partNumber,

                        quantity: cleanNumber(quantity),

                        condition,

                        state: sparePartState,

                        city: sparePartCity,
                    },
                }),
            });


            const data = await res.json();
            if (!res.ok) {
                setFormError(data.message || "Failed to create listing");
                return;
            }

            // alert(JSON.stringify(data, null, 2));
            router.push("/dashboard/pending-listings")

        } catch (err) {
            alert("Error creating listing");

        } finally {
            setLoading(false);
        }
    };

    const hasBasicInformation =
        title.trim() !== "" &&
        description.trim() !== "" &&
        price.trim() !== "";

    const hasCategory =
        parentCategoryId !== "" &&
        categoryId !== "";

    const hasAssetDetails = (() => {
        if (!parentCategoryId) {
            return false;
        }

        if (isEquipment) {
            const hasValidBrand =
                brand === "Other"
                    ? customBrand.trim() !== ""
                    : brand.trim() !== "";

            return (
                hasValidBrand &&
                model.trim() !== "" &&
                year.trim() !== "" &&
                condition.trim() !== ""
            );
        }

        if (isProperty) {
            return (
                propertyState.trim() !== "" &&
                propertyCity.trim() !== ""
            );
        }

        if (isQuarry) {
            return (
                quarryType.trim() !== "" &&
                reserveEstimate.trim() !== ""
            );
        }

        if (isSparePart) {
            return (
                partName.trim() !== "" &&
                condition.trim() !== ""
            );
        }

        return false;
    })();

    const hasImages =
        imageUrls.length > 0;

    const currentStep =
        !hasBasicInformation
            ? 1
            : !hasCategory
                ? 2
                : !hasAssetDetails
                    ? 3
                    : !hasImages
                        ? 4
                        : 5;

    const steps = [
        {
            number: 1,
            label: "Basic Info",
        },
        {
            number: 2,
            label: "Category",
        },
        {
            number: 3,
            label: "Asset Details",
        },
        {
            number: 4,
            label: "Images",
        },
        {
            number: 5,
            label: "Review",
        },
    ];

    return (
        <main className="min-h-screen bg-[#f7f7f5]">
            {/* TOP BAR */}

            <header className="border-b border-gray-200 bg-white">
                <div
                    className="
        mx-auto
        flex
        max-w-7xl
        flex-col
        gap-4
        px-4
        py-5
        sm:flex-row
        sm:items-center
        sm:justify-between
        sm:px-6
        lg:px-8
    "
                >
                    <div>
                        <p
                            className="
            text-[10px]
            font-extrabold
            uppercase
            tracking-[0.18em]
            text-orange-600
        "
                        >
                            Seller Dashboard
                        </p>

                        <h1
                            className="
            mt-2
            text-2xl
            font-extrabold
            text-[#24272b]
            sm:text-3xl
        "
                        >
                            Create a New Listing
                        </h1>

                        <p
                            className="
            mt-2
            max-w-2xl
            text-xs
            leading-5
            text-gray-500
            sm:text-sm
        "
                        >
                            Add your asset details, select a category,
                            upload clear images, and submit the listing
                            for review.
                        </p>
                    </div>

                    <span
                        className="
              hidden
              rounded-full
              bg-green-50
              px-3
              py-1.5
              text-[10px]
              font-bold
              text-green-700
              sm:inline-flex
            "
                    >
                        Draft saved automatically
                    </span>
                </div>
            </header>

            {user?.role === "SELLER" && user?.isApproved === false && (
                <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    Your seller account is pending approval. You can&apos;t create listings
                    until an admin approves you.
                </div>
            )}
            {formError && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {formError}
                </div>
            )}

            <div
                className="
          mx-auto
          max-w-7xl
          px-4
          py-5
          sm:px-6
          lg:px-8
          lg:py-7
        "
            >
                {/* PAGE GRID */}

                <div
                    className="
            grid
            gap-6
            lg:grid-cols-[minmax(0,1fr)_300px]
            lg:items-start
          "
                >
                    {/* MAIN FORM */}

                    <div className="min-w-0">
                        {/* MOBILE TITLE */}

                        <div className="mb-5 lg:hidden">
                            <h2
                                className="
                  text-xl
                  font-extrabold
                  text-[#24272b]
                "
                            >
                                Create Listing
                            </h2>

                            <p
                                className="
                  mt-1
                  text-xs
                  leading-5
                  text-gray-500
                "
                            >
                                Add your listing details and submit it for review.
                            </p>
                        </div>

                        {/* PROGRESS STEPS */}

                        <section
                            className="
                rounded-xl
                border
                border-gray-200
                bg-white
                p-4
                shadow-sm
                sm:p-5
              "
                        >
                            <div
                                className="
                  flex
                  items-start
                  justify-between
                  gap-1
                "
                            >
                                {steps.map((step, index) => {
                                    const isComplete =
                                        step.number < currentStep;

                                    const isCurrent =
                                        step.number === currentStep;

                                    return (
                                        <div
                                            key={step.number}
                                            className="
                        relative
                        flex
                        min-w-0
                        flex-1
                        flex-col
                        items-center
                      "
                                        >
                                            {index < steps.length - 1 && (
                                                <div
                                                    className={`
                            absolute
                            left-1/2
                            top-4
                            h-[2px]
                            w-full
                            ${step.number < currentStep
                                                            ? "bg-orange-500"
                                                            : "bg-gray-200"
                                                        }
                          `}
                                                />
                                            )}

                                            <div
                                                className={`
                          relative
                          z-10
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-full
                          text-[10px]
                          font-extrabold
                          ${isComplete
                                                        ? "bg-green-600 text-white"
                                                        : isCurrent
                                                            ? "bg-orange-500 text-white"
                                                            : "border border-gray-200 bg-white text-gray-400"
                                                    }
                        `}
                                            >
                                                {isComplete
                                                    ? "✓"
                                                    : step.number}
                                            </div>

                                            <span
                                                className={`
                          mt-2
                          text-center
                          text-[10px]
                          font-semibold
                          sm:block
                          ${isCurrent
                                                        ? "text-[#24272b]"
                                                        : "text-gray-400"
                                                    }
                        `}
                                            >
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div
                                className="
                  mt-4
                  h-1.5
                  overflow-hidden
                  rounded-full
                  bg-gray-100
                  sm:hidden
                "
                            >
                                <div
                                    className="
        h-full
        rounded-full
        bg-orange-500
        transition-all
        duration-500
    "
                                    style={{
                                        width: `${(currentStep / steps.length) * 100}%`,
                                    }}
                                />

                                <p
                                    className="
                  mt-3
                  text-center
                  text-[10px]
                  font-semibold
                  text-gray-400
                  sm:hidden
                "
                                >
                                    Step {currentStep} of {steps.length}
                                </p>
                            </div>

                        </section>

                        {/* FORM CONTENT */}

                        <form
                            id="create-listing-form"
                            onSubmit={handleSubmit}

                            className="mt-5 space-y-5"
                        >

                            {/* BASIC INFORMATION */}

                            <section
                                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  p-4
                  shadow-sm
                  sm:p-6
                "
                            >
                                <div
                                    className="
                    mb-5
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                                >
                                    <div>
                                        <h2
                                            className="
                        text-sm
                        font-extrabold
                        text-[#24272b]
                      "
                                        >
                                            Basic Information
                                        </h2>

                                        <p
                                            className="
                        mt-1
                        text-[10px]
                        text-gray-500
                      "
                                        >
                                            Add the main information about your asset.
                                        </p>
                                    </div>

                                    <span
                                        className="
                      rounded-full
                      bg-orange-50
                      px-2.5
                      py-1
                      text-[8px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-orange-600
                    "
                                    >
                                        Required
                                    </span>
                                </div>

                                <BasicInformation
                                    title={title}
                                    setTitle={setTitle}
                                    description={description}
                                    setDescription={setDescription}
                                    price={price}
                                    setPrice={setPrice}
                                />
                            </section>

                            {/* CATEGORY */}

                            <section
                                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  p-4
                  shadow-sm
                  sm:p-6
                "
                            >
                                <div className="mb-5">
                                    <h2
                                        className="
                      text-sm
                      font-extrabold
                      text-[#24272b]
                    "
                                    >
                                        Category
                                    </h2>

                                    <p
                                        className="
                      mt-1
                      text-[10px]
                      text-gray-500
                    "
                                    >
                                        Select the asset type and category.
                                    </p>
                                </div>

                                <CategorySelector
                                    categories={categories}
                                    parentCategoryId={parentCategoryId}
                                    setParentCategoryId={
                                        setParentCategoryId
                                    }
                                    categoryId={categoryId}
                                    setCategoryId={
                                        setCategoryId
                                    }
                                />
                            </section>

                            {/* EQUIPMENT */}

                            {isEquipment && (
                                <section
                                    className="
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    p-4
                    shadow-sm
                    sm:p-6
                  "
                                >
                                    <div className="mb-5">
                                        <h2
                                            className="
                        text-sm
                        font-extrabold
                        text-[#24272b]
                      "
                                        >
                                            Equipment Details
                                        </h2>

                                        <p
                                            className="
                        mt-1
                        text-[10px]
                        text-gray-500
                      "
                                        >
                                            Enter the equipment specifications.
                                        </p>
                                    </div>

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

                                        city={city}
                                        setCity={setCity}
                                    />
                                </section>
                            )}

                            {/* PROPERTY */}

                            {isProperty && (
                                <section
                                    className="
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    p-4
                    shadow-sm
                    sm:p-6
                  "
                                >
                                    <div className="mb-5">
                                        <h2
                                            className="
                        text-sm
                        font-extrabold
                        text-[#24272b]
                      "
                                        >
                                            Property Details
                                        </h2>

                                        <p
                                            className="
                        mt-1
                        text-[10px]
                        text-gray-500
                      "
                                        >
                                            Enter the property information.
                                        </p>
                                    </div>

                                    <PropertyForm
                                        propertyCategory={
                                            categories.find(
                                                (c) =>
                                                    c.id ===
                                                    Number(
                                                        categoryId
                                                    )
                                            )?.name || ""
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
                                </section>
                            )}

                            {/* QUARRY */}

                            {isQuarry && (
                                <section
                                    className="
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    p-4
                    shadow-sm
                    sm:p-6
                  "
                                >
                                    <div className="mb-5">
                                        <h2
                                            className="
                        text-sm
                        font-extrabold
                        text-[#24272b]
                      "
                                        >
                                            Quarry Details
                                        </h2>
                                    </div>

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
                                </section>
                            )}

                            {/* SPARE PART */}

                            {isSparePart && (
                                <section
                                    className="
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    p-4
                    shadow-sm
                    sm:p-6
                  "
                                >
                                    <div className="mb-5">
                                        <h2
                                            className="
                        text-sm
                        font-extrabold
                        text-[#24272b]
                      "
                                        >
                                            Spare Part Details
                                        </h2>
                                    </div>

                                    <SparePartForm
                                        partName={partName}
                                        setPartName={
                                            setPartName
                                        }

                                        brand={brand}
                                        setBrand={
                                            setBrand
                                        }

                                        customBrand={customBrand}
                                        setCustomBrand={setCustomBrand}

                                        model={model}
                                        setModel={
                                            setModel
                                        }

                                        partNumber={
                                            partNumber
                                        }
                                        setPartNumber={
                                            setPartNumber
                                        }

                                        quantity={quantity}
                                        setQuantity={
                                            setQuantity
                                        }

                                        condition={
                                            condition
                                        }
                                        setCondition={
                                            setCondition
                                        }

                                        state={
                                            sparePartState
                                        }
                                        setState={
                                            setSparePartState
                                        }

                                        city={
                                            sparePartCity
                                        }
                                        setCity={
                                            setSparePartCity
                                        }
                                    />
                                </section>
                            )}

                            {/* IMAGES */}

                            <section
                                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  p-4
                  shadow-sm
                  sm:p-6
                "
                            >
                                <div className="mb-5">
                                    <h2
                                        className="
                      text-sm
                      font-extrabold
                      text-[#24272b]
                    "
                                    >
                                        Listing Images
                                    </h2>

                                    <p
                                        className="
                      mt-1
                      text-[10px]
                      text-gray-500
                    "
                                    >
                                        Upload clear images of the asset.
                                    </p>
                                </div>

                                <ImageUploader
                                    imageUrls={imageUrls}
                                    setImageUrls={
                                        setImageUrls
                                    }
                                />
                            </section>

                            {/* MOBILE SUBMIT */}

                            <div className="lg:hidden">
                                <SubmitButton
                                    loading={loading}
                                    disabled={isPendingSeller}
                                />
                            </div>
                        </form>
                    </div>

                    {/* DESKTOP SIDEBAR */}

                    <aside className="hidden lg:block">
                        <div
                            className="
                sticky
                top-24
                space-y-4
              "
                        >
                            <section
                                className="
                  rounded-xl
                  border
                  border-green-200
                  bg-green-50
                  p-5
                "
                            >
                                <div
                                    className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                                >
                                    <h2
                                        className="
                      text-xs
                      font-extrabold
                      text-green-900
                    "
                                    >
                                        Listing Summary
                                    </h2>

                                    <span
                                        className="
                      rounded-full
                      bg-green-600
                      px-2
                      py-1
                      text-[8px]
                      font-bold
                      text-white
                    "
                                    >
                                        Draft
                                    </span>
                                </div>

                                <div
                                    className="
                    mt-4
                    space-y-3
                    text-[10px]
                  "
                                >
                                    <SummaryRow
                                        label="Title"
                                        value={title}
                                    />

                                    <SummaryRow
                                        label="Category"
                                        value={
                                            categories.find(
                                                (c) => c.id === Number(categoryId)
                                            )?.name
                                        }
                                    />

                                    <SummaryRow
                                        label="Price"
                                        value={
                                            price
                                                ? `₦${Number(price).toLocaleString()}`
                                                : "Not provided"
                                        }
                                    />

                                    <SummaryRow
                                        label="Images"
                                        value={`${imageUrls.length} uploaded`}
                                    />
                                </div>
                            </section>

                            <section
                                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  p-5
                  shadow-sm
                "
                            >
                                <h2
                                    className="
                    text-xs
                    font-extrabold
                    text-[#24272b]
                  "
                                >
                                    Admin Approval Required
                                </h2>

                                <p
                                    className="
                    mt-2
                    text-[10px]
                    leading-5
                    text-gray-500
                  "
                                >
                                    Your listing will be reviewed before
                                    it becomes publicly visible.
                                    This usually takes 24–48 hours.
                                </p>
                            </section>

                            <SubmitButton
                                type="submit"
                                loading={loading}
                                form="create-listing-form"
                            />
                        </div>
                    </aside>
                </div>
            </div >
        </main >
    );
    function SummaryRow({
        label,
        value,
    }: {
        label: string;
        value: ReactNode;
    }) {
        return (
            <div className="flex items-start justify-between gap-6 border-b border-gray-100 py-3 last:border-b-0">
                <span className="text-xs font-medium text-gray-500">
                    {label}
                </span>

                <span className="max-w-[60%] text-right text-xs font-bold text-[#24272b]">
                    {value || "Not provided"}
                </span>
            </div>
        );
    }
}