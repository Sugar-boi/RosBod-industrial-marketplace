const prisma = require("../lib/prisma");
const formatListing = (listing) => {
    if (!listing) return listing;

    const {
        user,
        listingimage,
        ...rest
    } = listing;

    return {
        ...rest,
        seller: user,
        images: listingimage || [],
    };
};

// helper at top of the file (optional but clean)
const toFloat = (v) =>
    v === "" || v === null || v === undefined || Number.isNaN(Number(v))
        ? null
        : Number(v);

const toInt = (v) => {
    const n = toFloat(v);
    return n === null ? null : Math.trunc(n);
};

const createListing = async (req, res) => {
    try {
        // fetch user from JWT
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
        });

        console.log("JWT USER ID:", req.user.userId);
        console.log("DB USER:", user);

        // 1) not logged in / user missing
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        // prevent unapproved sellers from creating listings
        if (user.role === "SELLER" && !user.isApproved) {
            return res.status(403).json({
                message:
                    "Your seller account is pending approval. You cannot create listings yet.",
            });
        }

        const {
            title,
            description,
            price,
            images,
            categoryId,
            isAuction,

            equipment,
            property,
            quarry,
            sparePart,

        } = req.body;

        console.log("REQ BODY:", req.body);
        console.log("CATEGORY ID:", categoryId);

        const listing = await prisma.listing.create({
            data: {
                title,
                description,
                price,
                sellerId: user.id,
                categoryId,
                isAuction,
                isApproved: false,

                listingimage: {
                    create: Array.isArray(images)
                        ? images.map((url) => ({
                            imageUrl: url,
                        }))
                        : [],
                },
            },

            include: {
                listingimage: true,
            },
        });

        // const responseListing = {
        //     ...listing,
        //     images: listing.listingimage,
        //     listingimage: undefined,
        // };

        // res.status(201).json(responseListing);

        const category = await prisma.category.findUnique({
            where: {
                id: Number(categoryId),
            },
        });
        const parentCategory = category?.parentId
            ? await prisma.category.findUnique({
                where: {
                    id: category.parentId,
                },
            })
            : null;

        const categoryGroup = parentCategory?.name;

        if (categoryGroup === "Equipment") {
            if (equipment) {
                await prisma.equipmentDetails.create({
                    data: {
                        listingId: listing.id,

                        brand: equipment.brand,
                        model: equipment.model,
                        year: toInt(equipment.year),

                        operatingHours: toInt(equipment.operatingHours),

                        bucketCapacity: equipment.bucketCapacity,

                        serialNumber: equipment.serialNumber,

                        condition: equipment.condition,

                        state: equipment.state,
                        city: equipment.city,

                        mechanicalCondition:
                            equipment.mechanicalCondition,

                        hydraulicCondition:
                            equipment.hydraulicCondition,
                    },
                });
            }
        }
        if (categoryGroup === "Properties") {
            if (property) {
                await prisma.propertyDetails.create({
                    data: {
                        listingId: listing.id,

                        propertyType:
                            property.propertyType,

                        plotSize: toFloat(property.plotSize),

                        plotUnit:
                            property.plotUnit,

                        bedrooms: toInt(property.bedrooms),

                        bathrooms:
                            toInt(property.bathrooms),

                        floors:
                            toInt(property.floors),

                        parkingSpaces:
                            toInt(property.parkingSpaces),

                        warehouseSize:
                            toFloat(property.warehouseSize),

                        factorySize:
                            toFloat(property.factorySize),

                        powerSupply:
                            property.powerSupply,

                        officeSpace:
                            property.officeSpace,

                        titleDocument:
                            property.titleDocument,

                        roadAccess:
                            property.roadAccess,

                        state:
                            property.state,

                        city:
                            property.city,

                        address:
                            property.address,
                    },
                });
            }
        }
        if (categoryGroup === "Quarry") {
            if (quarry) {
                await prisma.quarryDetails.create({
                    data: {
                        listingId: listing.id,

                        quarryType:
                            quarry.quarryType || null
                        ,

                        reserveEstimate:
                            quarry.reserveEstimate !== " " && quarry.reserveEstimate != null
                                ? toFloat(quarry.reserveEstimate)
                                : null,

                        productionCapacity:
                            quarry.productionCapacity || null,

                        miningLicense:
                            quarry.miningLicense || null,

                        state:
                            quarry.state || null,

                        city:
                            quarry.city || null,
                    },
                });
            }
        } if (categoryGroup === "Spare Parts") {
            if (sparePart) {
                await prisma.sparepartDetails.create({
                    data: {
                        listingId: listing.id,

                        partName: sparePart.partName,
                        brand: sparePart.brand,
                        model: sparePart.model,
                        partNumber: sparePart.partNumber,
                        quantity: toInt(sparePart.quantity),
                        condition: sparePart.condition,
                        state: sparePart.state,
                        city: sparePart.city,
                    },
                });
            }
        }

        const admins =
            await prisma.user.findMany({
                where: {
                    role: "ADMIN",
                },
            });

        for (const admin of admins) {
            await prisma.notification.create({
                data: {
                    userId: admin.id,
                    message: `${listing.title} is awaiting approval`,
                },
            });
        }


        if (isAuction) {
            await prisma.auction.create({
                data: {
                    listingId: listing.id,
                    startingBid: price,
                    currentBid: price,
                    startDate: new Date(),
                    endDate: new Date(
                        Date.now() + 7 * 24 * 60 * 60 * 1000
                    ),
                    updatedAt: new Date(),
                },
            });
        }
        const responseListing = formatListing(listing);

        console.log("RETURNING LISTING:");
        console.log(responseListing);

        return res.status(201).json(responseListing);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};

const recordListingView = async (req, res) => {
    try {
        const listingId = Number(req.params.id);

        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
        });

        if (!listing || !listing.isApproved) {
            return res.status(404).json({ message: "Listing not found" });
        }

        await prisma.listingView.create({
            data: { listingId },
        });

        res.json({ ok: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getMyListings = async (req, res) => {
    try {
        const userId = req.user.userId;

        const listings = await prisma.listing.findMany({
            where: {
                sellerId: userId,
            },

            include: {
                category: {
                    include: {
                        category: true,
                    },
                },

                listingimage: true,
                auction: true,
            },

            orderBy: {
                createdAt: "desc",
            },
        });

        res.status(200).json(
            listings.map(formatListing)
        );

    } catch (error) {

        console.error(
            "GET MY LISTINGS ERROR:",
            error
        );

        res.status(500).json({
            message: "Server Error",
        });

    }
};


const getListings = async (req, res) => {
    try {
        const {
            search,
            categoryId,
            sort,
        } = req.query;

        const where = {
            isApproved: true,
        };

        if (search) {
            where.title = {
                contains: search,
            };
        }

        if (categoryId) {
            where.categoryId =
                Number(categoryId);
        }
        let orderBy = {
            createdAt: "desc",
        };

        if (sort === "oldest") {
            orderBy = {
                createdAt: "asc",
            };
        }

        if (sort === "priceAsc") {
            orderBy = {
                price: "asc",
            };
        }

        if (sort === "priceDesc") {
            orderBy = {
                price: "desc",
            };
        }

        // const listings = await prisma.listing.findMany({
        //     where,
        //     include: {
        //         user: true,
        //         category: {
        //             include: {
        //                 category: true,
        //             },
        //         },
        //         listingimage: true,
        //         equipmentDetails: true,
        //         propertyDetails: true,
        //         quarryDetails: true,
        //         sparepartDetails: true,
        //         auction: {
        //             include: {
        //                 bid: true,
        //             },
        //         },
        //     },
        //     orderBy,
        // });
        const listings = await prisma.listing.findMany({
            where,
            include: {
                user: true,

                category: {
                    include: {
                        category: true,
                    },
                },

                listingimage: true,

                equipmentDetails: true,
                propertyDetails: true,
                quarryDetails: true,
                sparepartDetails: true,

                auction: {
                    include: {
                        bid: true,
                    },
                },
            },

            orderBy,
        });



        res.json(
            listings.map(formatListing)
        );
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const getRelatedListings = async (req, res) => {
    try {
        const listingId =
            Number(req.params.id);

        const listing =
            await prisma.listing.findUnique({
                where: {
                    id: listingId,
                },
                select: {
                    id: true,
                    categoryId: true,
                },
            });

        if (!listing) {
            return res.status(404).json({
                message:
                    "Listing not found",
            });
        }

        const includeData = {
            user: true,
            listingimage: true,

            category: {
                include: {
                    category: true,
                },
            },

            equipmentDetails: true,

            propertyDetails: true,

            quarryDetails: true,

            sparepartDetails: true,

            auction: true,
        };

        /*
        First:
        Get listings from the same category.
        */

        const sameCategoryListings =
            await prisma.listing.findMany({
                where: {
                    id: {
                        not:
                            listing.id,
                    },

                    isApproved:
                        true,

                    isSold:
                        false,

                    categoryId:
                        listing.categoryId,
                },

                include:
                    includeData,

                take: 4,

                orderBy: {
                    createdAt:
                        "desc",
                },
            });

        /*
        If we already have 4,
        return them.
        */

        if (sameCategoryListings.length >= 4) {
            return res.json(
                sameCategoryListings.map(formatListing)
            );
        }

        /*
        Calculate how many more
        listings are needed.
        */

        const remainingCount =
            4 -
            sameCategoryListings.length;

        /*
        Get other approved listings
        from different categories.
        */

        const fallbackListings =
            await prisma.listing.findMany({
                where: {
                    id: {
                        notIn: [
                            listing.id,

                            ...sameCategoryListings.map(
                                (
                                    relatedListing
                                ) =>
                                    relatedListing.id
                            ),
                        ],
                    },

                    isApproved:
                        true,

                    isSold:
                        false,
                },

                include:
                    includeData,

                take:
                    remainingCount,

                orderBy: {
                    createdAt:
                        "desc",
                },
            });

        /*
        Combine same-category
        and fallback listings.
        */

        const relatedListings = [
            ...sameCategoryListings,
            ...fallbackListings,
        ];

        return res.json(
            relatedListings.map(formatListing)
        );

    } catch (err) {

        console.error(
            "Failed to get related listings:",
            err
        );

        return res.status(500).json({
            message:
                "Server Error",
        });
    }

};


const markListingSold = async (req, res) => {
    try {
        const listing = await prisma.listing.findUnique({
            where: {
                id: Number(req.params.id),
            },
        });

        if (!listing) {
            return res.status(404).json({
                message: "Listing not found",
            });
        }

        // Only the seller who owns the listing can mark it sold
        if (listing.sellerId !== req.user.userId) {
            return res.status(403).json({
                message: "Unauthorized",
            });
        }

        const updated = await prisma.listing.update({
            where: {
                id: listing.id,
            },
            data: {
                isSold: true,
                soldAt: new Date(),
            },
        });

        res.json(updated);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const getListingById = async (req, res) => {
    try {
        const listing = await prisma.listing.findUnique({

            where: {
                id: Number(req.params.id),
            },
            include: {
                user: true,
                category: {
                    include: {
                        category: true,
                    },
                },
                listingimage: true,
                equipmentDetails: true,
                propertyDetails: true,
                quarryDetails: true,
                sparepartDetails: true,
                auction: {
                    include: { bid: true },
                },
            },
        });

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        const formattedListing = formatListing(listing);

        console.log("========== DEBUG ==========");
        console.log("Listing seller:", listing.sellerId);
        console.log("Approved:", listing.isApproved);

        console.log("REQ.USER:", req.user);
        const isOwner =
            req.user &&
            listing.sellerId === req.user.userId;

        const isAdmin =
            req.user &&
            req.user.role === "ADMIN";

        console.log("isOwner:", isOwner);
        console.log("isAdmin:", isAdmin);
        console.log("===========================");

        // ✅ PUBLIC ACCESS RULE
        if (listing.isApproved) {
            return res.json(formattedListing);
        }

        if (isAdmin || isOwner) {
            return res.json(formattedListing);
        }
        // ❌ EVERYTHING ELSE
        return res.status(403).json({
            message: "Listing pending approval",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getListingsByIds = async (req, res) => {

    try {

        const { ids } = req.body;

        const listings = await prisma.listing.findMany({

            where: {
                id: {
                    in: ids,
                },
            },

            include: {

                listingimage: true,

                category: {
                    include: {
                        category: true,
                    },
                },
                equipmentDetails: true,
                propertyDetails: true,
                quarryDetails: true,
                sparepartDetails: true,
                auction: true,

                user: {
                    select: {
                        id: true,
                        name: true,
                        isApproved: true,
                    },
                },

            },

        });

        res.json(
            listings.map(formatListing)
        );


    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Server Error",
        });
    }

};


module.exports = {
    createListing,
    getListings,
    getListingById,
    getMyListings,
    getRelatedListings,
    markListingSold,
    getListingsByIds,
    recordListingView,
};