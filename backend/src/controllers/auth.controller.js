const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");


const register = async (req, res) => {
    try {
        const { name, email, password, role, phone, whatsapp } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });


        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationCode =
            Math.floor(
                100000 + Math.random() * 900000
            ).toString();

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,

                phone: phone || null,
                whatsapp: whatsapp || null,

                verificationCode,
                isEmailVerified: false,

                role:
                    role === "SELLER"
                        ? "SELLER"
                        : "BUYER",

                isApproved:
                    role === "SELLER"
                        ? false
                        : true,
            },
        });

        const { password: _, ...safeUser } = user;


        console.log(
            "Verification Code:",
            verificationCode
        );
        res.status(201).json({
            message: "User created successfully",
            user: safeUser,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        // if (!user.isEmailVerified) {
        //     return res.status(403).json({
        //         message: "Please verify your email first",
        //     });
        // }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        const { password: _, ...safeUser } = user;

        res.status(200).json({
            message: "Login successful",
            token,
            user: safeUser,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};


module.exports = {
    register,
    login,
};