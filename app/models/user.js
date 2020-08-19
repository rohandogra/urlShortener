const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  user_name: {
    type: String,
    required: true,
    min: 5,
    max: 255,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    // required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  mobile: {
    type: Number,
    // required: true,
    min: 10,
    // max: 11,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
