require("dotenv").config();
require("express-async-errors");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const routers = require("./routers");
const { connectToDB } = require("./utils/db");
const errorhandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;
const morganLog =
  process.env.NODE_ENV === "production" ? morgan("common") : morgan("dev");

app.use(helmet());
app.use(cors());
app.use(morganLog);
app.use(express.json());

app.use("/api", routers);
app.use(errorhandler);

connectToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listen at ${PORT}`);
    });
  })
  .catch((e) => {
    console.log(e.message);
    process.exit(1);
  });
