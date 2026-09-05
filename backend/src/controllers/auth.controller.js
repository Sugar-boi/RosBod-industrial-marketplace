const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const { sendVerificationCode, sendPasswordResetCode } = require("../lib/mail");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuth = async (req, res) => {
    try {
        const { credential, role } = req.body;
        // credential = Google ID token from the button

        if (!credential) {
            return res.status(400).json({
                message: "Google credential is required",
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload?.email) {
            return res.status(400).json({
                message: "Google account has no email",
            });
        }

        const email = payload.email;
        const name = payload.name || email.split("@")[0];

        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // New user via Google
            const chosenRole =
                role === "SELLER" ? "SELLER" : "BUYER";

            user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: "", // Google users have no password
                    role: chosenRole,
                    isEmailVerified: true,
                    isApproved: chosenRole === "SELLER" ? false : true,
                    verificationCode: null,
                },
            });
        }

        // Existing user: already has role in DB — don't overwrite casually

        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const { password: _, ...safeUser } = user;

        res.json({
            message: "Login successful",
            token,
            user: safeUser,
        });
    } catch (error) {
        console.error("GOOGLE AUTH ERROR:", error);
        res.status(401).json({
            message: "Google sign-in failed",
        });
    }
};

const register = async (req, res) => {
    try {
        const { name, email, password, role, phone, whatsapp } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationCode = Math.floor(
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
                role: role === "SELLER" ? "SELLER" : "BUYER",
                isApproved: role === "SELLER" ? false : true,
            },
        });

        try {
            await sendVerificationCode(email, verificationCode, name);
        } catch (mailError) {
            console.error("Failed to send verification email:", mailError);
        }

        const { password: _, verificationCode: __, ...safeUser } = user;

        res.status(201).json({
            message:
                "User created successfully. Please check your email for the verification code.",
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
            where: { email: email.trim() },
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({
                message: "Please verify your email first",
            });
        }

        if (!user.password) {
            return res.status(400).json({
                message:
                    "This account uses Google sign-in. Please continue with Google.",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

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
            { expiresIn: "7d" }
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

const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                message: "Email and code are required",
            });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                message: "Email already verified",
            });
        }

        if (user.verificationCode !== String(code).trim()) {
            return res.status(400).json({
                message: "Invalid verification code",
            });
        }

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: {
                isEmailVerified: true,
                verificationCode: null,
            },
        });

        const { password: _, ...safeUser } = updated;

        res.json({
            message: "Email verified successfully",
            user: safeUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                message: "Email already verified",
            });
        }

        const verificationCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        await prisma.user.update({
            where: { id: user.id },
            data: { verificationCode },
        });

        await sendVerificationCode(email, verificationCode, user.name);

        res.json({
            message: "Verification code sent",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Don't reveal whether the email exists
        if (!user) {
            return res.json({
                message:
                    "If an account exists with that email, a reset code has been sent.",
            });
        }

        const verificationCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        await prisma.user.update({
            where: { id: user.id },
            data: { verificationCode },
        });

        try {
            await sendPasswordResetCode(email, verificationCode, user.name);
        } catch (mailError) {
            console.error("Failed to send reset email:", mailError);
            return res.status(500).json({
                message: "Failed to send reset email",
            });
        }

        res.json({
            message:
                "If an account exists with that email, a reset code has been sent.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, code, password } = req.body;

        if (!email || !code || !password) {
            return res.status(400).json({
                message: "Email, code, and new password are required",
            });
        }

        if (String(password).length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters",
            });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || user.verificationCode !== String(code).trim()) {
            return res.status(400).json({
                message: "Invalid or expired reset code",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                verificationCode: null,
                // optional: mark email verified if they could receive the code
                isEmailVerified: true,
            },
        });

        res.json({
            message: "Password reset successfully. You can now log in.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    register,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword,
    resendVerification,
    googleAuth,
};