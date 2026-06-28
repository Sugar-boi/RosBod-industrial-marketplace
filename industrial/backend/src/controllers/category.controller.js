const prisma = require("../lib/prisma");

const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();

        res.json(categories);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        const category =
            await prisma.category.create({
                data: {
                    name,
                },
            });

        res.status(201).json(category);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

module.exports = {
    getCategories,
    createCategory,
};