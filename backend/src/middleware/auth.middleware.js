const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        console.log("AUTH HEADER:", req.headers.authorization);
        const authHeader = req.headers.authorization;

         if (!authHeader) {
            return res.status(401).json({
                message: "No token provided",
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
        message: "Invalid authorization format",
    });
}

const token = authHeader.split(" ")[1];
console.log("TOKEN:", token);
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
 console.log("DECODED:", decoded);
        req.user = decoded;

        next();

    } catch (error) {
    console.error("JWT ERROR:", error);

    return res.status(401).json({
        message: "Invalid token",
    });
}
};

module.exports = authMiddleware;