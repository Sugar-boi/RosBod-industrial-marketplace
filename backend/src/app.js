const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const listingRoutes = require("./routes/listing.routes");
const auctionRoutes = require("./routes/auctions.routes");
const adminRoutes = require("./routes/admin.routes");
const categoryRoutes = require("./routes/category.routes");
const sellerRoutes = require("./routes/seller.routes");
const uploadRoutes = require("./routes/upload.routes");
const favoriteRoutes = require("./routes/favorite.routes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/favorites", favoriteRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Industrial Marketplace API", });
});

module.exports = app;