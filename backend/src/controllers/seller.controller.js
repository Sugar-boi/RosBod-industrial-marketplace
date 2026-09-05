const prisma = require("../lib/prisma");
const toFloat = (v) =>
    v === "" || v === null || v === undefined || Number.isNaN(Number(v))
        ? null
        : Number(v);

const toInt = (v) => {
    const n = toFloat(v);
    return n === null ? null : Math.trunc(n);
};
const formatAuction = (auction) => {
    if (!auction) return auction;

    const listing = auction.listing
        ? {
            ...auction.listing,
            seller: auction.listing.user || auction.listing.seller || null,
            images:
                auction.listing.listingimage ||
                auction.listing.images ||
                [],
        }
        : null;

    if (listing) {
        delete listing.user;
        delete listing.listingimage;
    }

    return {
        ...auction,
        listing,
        bids: auction.bid || auction.bids || [],
        bid: undefined,
    };
};

const getSellerStats = async (req, res) => {
    try {
        const sellerId = req.user.userId;

        const [
            activeListings,
            soldListings,
            pendingListings,
            activeAuctions,
            reviewsReceived,
        ] = await Promise.all([

            prisma.listing.count({
                where: {
                    sellerId,
                    isSold: false,
                    isApproved: true,
                },
            }),

            prisma.listing.count({
                where: {
                    sellerId,
                    isSold: true,
                },
            }),

            prisma.listing.count({
                where: {
                    sellerId,
                    status: "PENDING",
                },
            }),

            prisma.auction.count({
                where: {
                    listing: {
                        sellerId,
                    },
                },
            }),

            prisma.review.count({
                where: {
                    sellerId,
                },
            }),

        ]);

        res.json({
            activeListings,
            soldListings,
            pendingListings,
            activeAuctions,
            reviewsReceived,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const getMyListings = async (req, res) => {
    try {
        const listings =
            await prisma.listing.findMany({
                where: {
                    sellerId: req.user.userId,
                },
                include: {
                    category: true,
                    listingimage: true,
                    auction: true,

                    equipmentDetails: true,
                    propertyDetails: true,
                    quarryDetails: true,
                    sparepartDetails: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

        res.json(listings);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const getMyListingById = async (
    req,
    res
) => {
    try {
        const listing =
            await prisma.listing.findFirst({
                where: {
                    id: Number(
                        req.params.id
                    ),
                    sellerId:
                        req.user.userId,
                },
                include: {
                    category: true,
                    listingimage: true,
                    auction: true,

                    equipmentDetails: true,
                    propertyDetails: true,
                    quarryDetails: true,
                    sparepartDetails: true,
                },
            });

        if (!listing) {
            return res.status(404).json({
                message:
                    "Listing not found",
            });
        }

        res.json(listing);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};
const getSellerProfile = async (req, res
) => {
    try {
        const seller = await prisma.user.findUnique({
            where: {
                id: Number(req.params.id),
            },
            select: {
                id: true,
                name: true,
                email: true,
                companyName: true,
                location: true,
                phone: true,
                whatsapp: true,
                about: true,
                createdAt: true,
                isApproved: true,

                listing: {
                    where: {
                        isApproved: true,
                    },
                    include: {
                        listingimage: true,
                        category: true,
                        auction: true,
                    },
                },
            },
        });

        if (!seller) {
            return res.status(404).json({
                message: "Seller not found",
            });
        }

        res.json(seller);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const deleteMyListing = async (req, res) => {
    try {
        const listingId = Number(req.params.id);

        const listing =
            await prisma.listing.findUnique({
                where: {
                    id: listingId,
                },
            });

        if (!listing) {
            return res.status(404).json({
                message: "Listing not found",
            });
        }

        if (
            listing.sellerId !==
            req.user.userId
        ) {
            return res.status(403).json({
                message: "Unauthorized",
            });
        }

        await prisma.listingimage.deleteMany({
            where: {
                listingId,
            },
        });

        await prisma.favorite.deleteMany({
            where: {
                listingId,
            },
        });
        await prisma.review.deleteMany({
            where: {
                listingId,
            },
        });

        const auction = await prisma.auction.findUnique({
            where: {
                listingId,
            },
            include: {
                listing: {
                    include: {
                        listingimage: true,
                        user: true,
                        category: true,
                    },
                },

                bid: {
                    include: {
                        user: true,
                    },
                    orderBy: {
                        amount: "desc",
                    },
                },
            }
        });

        if (auction) {
            await prisma.bid.deleteMany({
                where: {
                    auctionId: auction.id,
                },
            });

            await prisma.auction.delete({
                where: {
                    id: auction.id,
                },
            });
        }
        await prisma.notification.deleteMany({
            where: {
                listingId,
            },
        });

        await prisma.equipmentDetails.deleteMany({
            where: {
                listingId,
            },
        });

        await prisma.propertyDetails.deleteMany({
            where: {
                listingId,
            },
        });

        await prisma.quarryDetails.deleteMany({
            where: {
                listingId,
            },
        });
        await prisma.sparepartDetails.deleteMany({
            where: {
                listingId,
            },
        });
        console.log({
            listingimage: await prisma.listingimage.count({ where: { listingId } }),
            favorites: await prisma.favorite.count({ where: { listingId } }),
            reviews: await prisma.review.count({ where: { listingId } }),
            notifications: await prisma.notification.count({ where: { listingId } }),
            equipment: await prisma.equipmentDetails.count({ where: { listingId } }),
            property: await prisma.propertyDetails.count({ where: { listingId } }),
            quarry: await prisma.quarryDetails.count({ where: { listingId } }),
            sparepart: await prisma.sparepartDetails.count({ where: { listingId } }),
        });

        await prisma.listing.delete({
            where: {
                id: listingId,
            },
        });

        res.json({
            message:
                "Listing deleted successfully",
        });
    } catch (error) {
        console.error("DELETE ERROR:", error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const updateMyListing = async (req, res) => {
    try {
        const listingId = Number(req.params.id);

        const listing =
            await prisma.listing.findUnique({
                where: {
                    id: listingId,
                },
            });

        if (!listing) {
            return res.status(404).json({
                message: "Listing not found",
            });
        }

        if (
            listing.sellerId !==
            req.user.userId
        ) {
            return res.status(403).json({
                message: "Unauthorized",
            });
        }

        const {
            title,
            description,
            price,
            categoryId,

            images,
            isAuction,

            // Equipment
            brand,
            model,
            year,
            hoursWorked,
            bucketCapacity,
            serialNumber,
            condition,
            locationState,
            city,
            mechanicalCondition,
            hydraulicCondition,

            // Property
            plotSize,
            plotUnit,
            bedrooms,
            bathrooms,
            floors,
            parkingSpaces,
            warehouseSize,
            factorySize,
            powerSupply,
            officeSpace,
            titleDocument,
            roadAccess,
            propertyState,
            propertyCity,
            address,

            // Quarry
            quarryType,
            reserveEstimate,
            productionCapacity,
            miningLicense,

            // Spare Parts
            partName,
            partBrand,
            partModel,
            partNumber,
            quantity,
            partCondition,
            partState,
            partCity,
        } = req.body;

        const data = {
            title,
            description,
            price: Number(price),
            categoryId: Number(categoryId),
            isAuction:
                isAuction === true,
        };

        /*
        ==========================================
        EQUIPMENT
        ==========================================
        */

        if (
            brand !== undefined ||
            model !== undefined ||
            year !== undefined ||
            hoursWorked !== undefined ||
            bucketCapacity !== undefined ||
            serialNumber !== undefined ||
            condition !== undefined ||
            locationState !== undefined ||
            city !== undefined ||
            mechanicalCondition !== undefined ||
            hydraulicCondition !== undefined
        ) {
            await prisma.equipmentDetails.upsert({
                where: {
                    listingId,
                },

                update: {
                    brand:
                        brand || null,

                    model:
                        model || null,

                    year:
                        year !== undefined && year !== null
                            ? Number(year)
                            : null,

                    operatingHours:
                        hoursWorked !== undefined && hoursWorked !== null
                            ? Number(hoursWorked)
                            : null,

                    bucketCapacity:
                        bucketCapacity || null,

                    serialNumber:
                        serialNumber || null,

                    condition:
                        condition || null,

                    state:
                        locationState || null,

                    city:
                        city || null,

                    mechanicalCondition:
                        mechanicalCondition ||
                        null,

                    hydraulicCondition:
                        hydraulicCondition ||
                        null,
                },

                create: {
                    listingId,

                    brand:
                        brand || null,

                    model:
                        model || null,

                    year:
                        year !== undefined && year !== null
                            ? Number(year)
                            : null,

                    operatingHours:
                        hoursWorked !== undefined && hoursWorked !== null
                            ? Number(hoursWorked)
                            : null,

                    bucketCapacity:
                        bucketCapacity || null,

                    serialNumber:
                        serialNumber || null,

                    condition:
                        condition || null,

                    state:
                        locationState || null,

                    city:
                        city || null,

                    mechanicalCondition:
                        mechanicalCondition ||
                        null,

                    hydraulicCondition:
                        hydraulicCondition ||
                        null,
                },
            });
        }

        /*
        ==========================================
        PROPERTY
        ==========================================
        */

        if (
            plotSize !== undefined ||
            plotUnit !== undefined ||
            bedrooms !== undefined ||
            bathrooms !== undefined ||
            floors !== undefined ||
            parkingSpaces !== undefined ||
            warehouseSize !== undefined ||
            factorySize !== undefined ||
            powerSupply !== undefined ||
            officeSpace !== undefined ||
            titleDocument !== undefined ||
            roadAccess !== undefined ||
            propertyState !== undefined ||
            propertyCity !== undefined ||
            address !== undefined
        ) {
            await prisma.propertyDetails.upsert({
                where: {
                    listingId,
                },

                update: {
                    plotSize:
                        plotSize !== undefined && plotSize !== null
                            ? Number(plotSize)
                            : null,

                    plotUnit:
                        plotUnit || null,

                    bedrooms:
                        bedrooms !== undefined && bedrooms !== null
                            ? Number(bedrooms)
                            : null,

                    bathrooms:
                        bathrooms !== undefined && bathrooms !== null
                            ? Number(bathrooms)
                            : null,

                    floors:
                        floors !== undefined && floors !== null
                            ? Number(floors)
                            : null,

                    parkingSpaces:
                        parkingSpaces
                            !== undefined && parkingSpaces !== null
                            ? Number(parkingSpaces)
                            : null,

                    warehouseSize:
                        warehouseSize
                            !== undefined && warehouseSize !== null
                            ? Number(warehouseSize)
                            : null,

                    factorySize:
                        factorySize
                            !== undefined && factorySize !== null
                            ? Number(factorySize)
                            : null,

                    powerSupply:
                        powerSupply || null,

                    officeSpace:
                        officeSpace === true,

                    titleDocument:
                        titleDocument || null,

                    roadAccess:
                        roadAccess === true,

                    state:
                        propertyState || null,

                    city:
                        propertyCity || null,

                    address:
                        address || null,
                },

                create: {
                    listingId,

                    plotSize:
                        plotSize !== undefined && plotSize !== null
                            ? Number(plotSize)
                            : null,
                    plotUnit:
                        plotUnit || null,

                    bedrooms:
                        bedrooms !== undefined && bedrooms !== null
                            ? Number(bedrooms)
                            : null,

                    bathrooms:
                        bathrooms !== undefined && bathrooms !== null
                            ? Number(bathrooms)
                            : null,

                    floors:
                        floors !== undefined && floors !== null
                            ? Number(floors)
                            : null,

                    parkingSpaces:
                        parkingSpaces !== undefined && parkingSpaces !== null
                            ? Number(
                                parkingSpaces
                            )
                            : null,

                    warehouseSize:
                        warehouseSize !== undefined && warehouseSize !== null
                            ? Number(
                                warehouseSize
                            )
                            : null,

                    factorySize:
                        factorySize !== undefined && factorySize !== null
                            ? Number(
                                factorySize
                            )
                            : null,

                    powerSupply:
                        powerSupply || null,

                    officeSpace:
                        officeSpace === true,

                    titleDocument:
                        titleDocument || null,

                    roadAccess:
                        roadAccess === true,

                    state:
                        propertyState || null,

                    city:
                        propertyCity || null,

                    address:
                        address || null,
                },
            });
        }

        /*
        ==========================================
        QUARRY
        ==========================================
        */

        if (
            quarryType !== undefined ||
            reserveEstimate !== undefined ||
            productionCapacity !== undefined ||
            miningLicense !== undefined
        ) {
            await prisma.quarryDetails.upsert({
                where: {
                    listingId,
                },

                update: {
                    quarryType:
                        quarryType || null,

                    reserveEstimate:
                        reserveEstimate !== undefined && reserveEstimate !== null
                            ? Number(
                                reserveEstimate
                            )
                            : null,

                    productionCapacity:
                        productionCapacity ||
                        null,

                    miningLicense:
                        miningLicense ||
                        null,
                },

                create: {
                    listingId,

                    quarryType:
                        quarryType || null,

                    reserveEstimate:
                        reserveEstimate
                            ? Number(
                                reserveEstimate
                            )
                            : null,

                    productionCapacity:
                        productionCapacity ||
                        null,

                    miningLicense:
                        miningLicense ||
                        null,
                },
            });
        }

        if (
            partName !== undefined ||
            partBrand !== undefined ||
            partModel !== undefined ||
            partNumber !== undefined ||
            quantity !== undefined ||
            partCondition !== undefined ||
            partState !== undefined ||
            partCity !== undefined
        ) {
            await prisma.sparepartDetails.upsert({
                where: {
                    listingId,
                },

                update: {
                    partName: partName || null,
                    brand: partBrand || null,
                    model: partModel || null,
                    partNumber: partNumber || null,
                    quantity: quantity
                        ? Number(quantity)
                        : null,
                    condition: partCondition || null,
                    state: partState || null,
                    city: partCity || null,
                },

                create: {
                    listingId,
                    partName: partName || null,
                    brand: partBrand || null,
                    model: partModel || null,
                    partNumber: partNumber || null,
                    quantity: quantity
                        ? Number(quantity)
                        : null,
                    condition: partCondition || null,
                    state: partState || null,
                    city: partCity || null,
                },
            });
        }

        /*
        ==========================================
        REJECTED → PENDING
        ==========================================
        */

        if (
            listing.status ===
            "REJECTED"
        ) {
            data.status = "PENDING";
            data.isApproved = false;
            data.rejectReason = null;
        }

        /*
        ==========================================
        UPDATE LISTING
        ==========================================
        */

        const updatedListing =
            await prisma.listing.update({
                where: {
                    id: listingId,
                },

                data,
            });

        /*
        ==========================================
        UPDATE IMAGES
        ==========================================
        */

        if (Array.isArray(images)) {
            await prisma.listingimage.deleteMany({
                where: {
                    listingId,
                },
            });

            if (images.length > 0) {
                await prisma.listingimage.createMany({
                    data: images.map((url) => ({
                        listingId,
                        imageUrl: url,
                    })),
                });
            }
        }

        res.json({
            message:
                "Listing updated successfully.",
            listing:
                updatedListing,
        });

    } catch (error) {
        console.error(
            "UPDATE MY LISTING ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Server Error",
        });
    }
};

const getMyProfile = async (req, res) => {
    try {
        const seller =
            await prisma.user.findUnique({
                where: {
                    id: req.user.userId,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    whatsapp: true,
                    companyName: true,
                    location: true,
                    about: true,
                    createdAt: true,
                    role: true,
                    isApproved: true,
                    avatar: true,
                },
            });

        res.json(seller);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const updateMyProfile = async (
    req,
    res
) => {
    try {
        const {
            name,
            phone,
            whatsapp,
            companyName,
            location,
            about,
            avatar,
        } = req.body;

        const user =
            await prisma.user.update({
                where: {
                    id: req.user.userId,
                },
                data: {
                    name,
                    phone,
                    whatsapp,
                    companyName,
                    location,
                    about,
                    avatar: avatar || null,
                },
            });

        res.json(user);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const getMyAuctions = async (
    req,
    res
) => {
    try {
        const auctions =
            await prisma.auction.findMany({
                where: {
                    listing: {
                        sellerId:
                            req.user.userId,
                    },
                },
                include: {
                    listing: {
                        include: {
                            listingimage: true,
                            category: true,
                        },
                    },
                },
            });

        res.json(auctions.map(formatAuction));
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message:
                "Server Error",
        });
    }
};

const getListingPerformance = async (req, res) => {
    try {
        const sellerId = req.user.userId;
        const days = Number(req.query.days) || 30;
        const since = new Date();
        since.setDate(since.getDate() - days);

        const sellerListings = await prisma.listing.findMany({
            where: { sellerId },
            select: { id: true },
        });

        const listingIds = sellerListings.map((l) => l.id);

        if (listingIds.length === 0) {
            return res.json({ days, points: [] });
        }

        const views = await prisma.listingView.findMany({
            where: {
                listingId: { in: listingIds },
                createdAt: { gte: since },
            },
            select: { createdAt: true },
            orderBy: { createdAt: "asc" },
        });

        // bucket by date YYYY-MM-DD
        const buckets = {};
        for (let i = 0; i <= days; i++) {
            const d = new Date(since);
            d.setDate(since.getDate() + i);
            const key = d.toISOString().slice(0, 10);
            buckets[key] = 0;
        }

        for (const v of views) {
            const key = new Date(v.createdAt).toISOString().slice(0, 10);
            if (buckets[key] != null) buckets[key] += 1;
        }

        const points = Object.entries(buckets).map(([date, count]) => ({
            date,
            count,
        }));

        res.json({ days, total: views.length, points });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// const updateProfile = async (req, res) => {
//     try {
//         const sellerId = req.user.userId;

//         const {
//             companyName,
//             location,
//             about,
//             phone,
//             whatsapp,
//         } = req.body;

//         const updatedUser =
//             await prisma.user.update({
//                 where: {
//                     id: sellerId,
//                 },
//                 data: {
//                     companyName,
//                     location,
//                     about,
//                     phone,
//                     whatsapp,
//                 },
//             });

//         res.json(updatedUser);
//     } catch (error) {
//         console.error(error);

//         res.status(500).json({
//             message: "Server Error",
//         });
//     }
// };
module.exports = {
    getSellerStats,
    getMyListings,
    getMyListingById,
    getSellerProfile,
    getMyProfile,
    updateMyProfile,
    deleteMyListing,
    updateMyListing,
    getMyAuctions,
    getListingPerformance,
};