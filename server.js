const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require(`${__dirname}/server/app`);

dotenv.config({ path: `${__dirname}/server/config.env` });

if (typeof process.env.MONGODB_URI !== "undefined") {
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
}

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
