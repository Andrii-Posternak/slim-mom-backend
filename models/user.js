const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    token: String,
    height: {
      type: Number,
      min: 50,
      max: 250,
      default: null,
    },
    age: {
      type: Number,
      min: 1,
      max: 100,
      default: null,
    },
    currentWeight: {
      type: Number,
      min: 5,
      max: 250,
      default: null,
    },
    desiredWeight: {
      type: Number,
      min: 5,
      max: 250,
      default: null,
    },
    bloodType: {
      type: Number,
      enum: [1, 2, 3, 4],
      default: 1,
    },
    dailyRate: {
      type: Number,
      default: null,
    },
    notRecFood: {
      type: Array,
      title: {
        type: String,
      },
    },
  },
  { versionKey: false, timestamps: true }
);

const User = model("user", userSchema);

module.exports = User;
