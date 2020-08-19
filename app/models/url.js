const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  originalUrl: {
    type: String,
    require: true,
    unique: true,
  },
  hashUrl: {
    type: String,
  },
  clicks: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;
