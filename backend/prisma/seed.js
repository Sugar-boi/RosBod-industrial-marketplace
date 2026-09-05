const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {

    await prisma.category.deleteMany();

    const properties =
        await prisma.category.create({
            data: {
                name: "Properties",
            },
        });

    const quarry =
        await prisma.category.create({
            data: {
                name: "Quarry",
            },
        });

    const equipment =
        await prisma.category.create({
            data: {
                name: "Equipment",
            },
        });

        const spareParts =
        await prisma.category.create({
            data: {
                name: "Spare Parts",
            },
        });        


    await prisma.category.createMany({
        data: [

            { name: "Residential Land", parentId: properties.id },
            { name: "Commercial Land", parentId: properties.id },
            { name: "Industrial Land", parentId: properties.id },
            { name: "Farm Land", parentId: properties.id },
            { name: "House", parentId: properties.id },
            { name: "Duplex", parentId: properties.id },
            { name: "Apartment", parentId: properties.id },
            { name: "Warehouse", parentId: properties.id },
            { name: "Factory", parentId: properties.id },

            { name: "Quarry For Sale", parentId: quarry.id },
            { name: "Quarry For Lease", parentId: quarry.id },
            { name: "Granite Quarry", parentId: quarry.id },
            { name: "Limestone Quarry", parentId: quarry.id },
            { name: "Sand Quarry", parentId: quarry.id },
            { name: "Quarry Partnership", parentId: quarry.id },

            { name: "Excavators", parentId: equipment.id },
            { name: "Bulldozers", parentId: equipment.id },
            { name: "Wheel Loaders", parentId: equipment.id },
            { name: "Crushers", parentId: equipment.id },
            { name: "Generators", parentId: equipment.id },
            { name: "Dump Trucks", parentId: equipment.id },
            { name: "Forklifts", parentId: equipment.id },
      
            { name: "Excavator Parts", parentId: spareParts.id },
            { name: "Bulldozer Parts", parentId: spareParts.id },
            { name: "Crusher Parts", parentId: spareParts.id },
            { name: "Generator Parts", parentId: spareParts.id },
            { name: "Truck Parts", parentId: spareParts.id },
            { name: "Loader Parts", parentId: spareParts.id },
            { name: "Forklift Parts", parentId: spareParts.id },
            { name: "Hydraulic Parts", parentId: spareParts.id },
            { name: "Engine Parts", parentId: spareParts.id },
            { name: "Undercarriage Parts", parentId: spareParts.id },
            { name: "Filters & Lubricants", parentId: spareParts.id },
            { name: "Tyres & Tracks", parentId: spareParts.id },
            { name: "Other Parts", parentId: spareParts.id },
        ],
    });

    console.log("Categories seeded");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());