const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./server/app");

dotenv.config({ path: "./server/config.env" });

const DB = process.env.MONGODB_URI.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("DB connection complete"));

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
