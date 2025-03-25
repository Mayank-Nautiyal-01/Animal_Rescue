const mongoose = require("mongoose");

const DistressCallSchema = new mongoose.Schema({
  userPhNo: { type: Number, required: false },
  userEmail: { type: String, required: false },
  animalType: { type: String, required: true },
  imgLink: { type: String, required: true },
  desc: { type: String },
  distressLocation: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "InProgress", "Completed"],
    default: "Pending",
  },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  ngos: [{ type: String }],
  assignedNGO: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

module.exports = mongoose.model("DistressCall", DistressCallSchema);
