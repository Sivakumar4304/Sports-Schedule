const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    sport: { type: String, required: true },
    dateTime: { type: Date, required: true },
    location: { type: String, required: true },
    maxParticipants: { type: Number, required: true },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sportsession", sessionSchema);
