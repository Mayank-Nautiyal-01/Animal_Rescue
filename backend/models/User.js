const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function () {
      return this.type !== "admin";
    },
  },
  type: {
    type: String,
    enum: ["admin", "ngo", "user"],
    required: true,
  },
  phNo: {
    type: Number,
    required: false,
  },
  email: {
    type: String,
    unique: true,
    required: false,
  },
  ngoName: {
    type: String,
    required: function () {
      return this.type === "ngo";
    },
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: function () {
        return this.type === "ngo";
      },
    },
    coordinates: {
      type: [Number],
      required: function () {
        return this.type === "ngo";
      },
    },
  },
  password: { type: String, required: true },
});

UserSchema.index({ location: "2dsphere" });

// Custom validation to ensure that either email or phNo is provided
UserSchema.path("phNo").validate(function (value) {
  if (!this.email && !value) {
    return false;
  }
  return true;
}, "Either Phone Number or Email is required");

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Ensure only one admin exists in the database
UserSchema.pre("save", async function (next) {
  if (this.type === "admin") {
    const existingAdmin = await mongoose
      .model("User")
      .countDocuments({ type: "admin" });
    if (existingAdmin >= 1 && !this.isNew) {
      return next(new Error("Only one admin is allowed"));
    }
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
