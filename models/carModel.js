const mongoose = require("mongoose");

monsose = require("mongoose");

const carSchema = mongoose.Schema(
  {
    make: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    engineType: {
      type: String,
      required: true,
      enum: ["Gasoline", "Hybrid", "Electric", "Diesel"],
    },
    horsepower: {
      type: Number,
      required: true,
    },
    torque: {
      type: Number,
    },
    transmissionType: {
      type: String,
      required: true,
      enum: ["Automatic", "Manual"],
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const carModel = mongoose.model("cars", carSchema);

module.exports = carModel;
