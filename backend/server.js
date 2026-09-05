require("dotenv").config();

const app = require("./src/app");
const settleExpiredAuctions = require("./src/jobs/auctionSettlement");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  setInterval(() => {
    settleExpiredAuctions();
  }, 60000);
});