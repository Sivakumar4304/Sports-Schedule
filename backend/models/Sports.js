// models/Sport.js
const mongoose = require("mongoose");

const sportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Sport || mongoose.model("Sport", sportSchema);
