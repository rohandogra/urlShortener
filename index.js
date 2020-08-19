const express = require("express");
const port = 3022;
const app = express();
require("dotenv").config();
const router = require("./config/routes");
const useragent = require("express-useragent");
const configure = require("./config/database");

configure();

app.use(express.json());
app.use(useragent.express());
app.use("/", router);
app.listen(port, () => {
  console.log("connected on port", port);
});
