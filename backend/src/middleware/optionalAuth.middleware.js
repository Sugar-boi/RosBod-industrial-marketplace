const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    console.log("====== OPTIONAL AUTH ======");
    console.log("URL:", req.originalUrl);

    const authHeader = req.headers.authorization;

    console.log("HEADER:", authHeader);

    if (!authHeader) {
        console.log("NO HEADER");
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("DECODED:", decoded);

        req.user = decoded;
    } catch (err) {
        console.log("JWT ERROR:", err.message);
    }

    next();
};