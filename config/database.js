const mongoose = require("mongoose");

const configure = () => {
  mongoose
    .connect("mongodb://localhost:27017/url-short", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => {
      console.log("Error conenction with db", err);
    });
};

module.exports = configure;
