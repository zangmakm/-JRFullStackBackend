const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    postBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    takenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
    },
    status: {
      type: String,
      required: true,
      default: "NEW",
      enum: ["NEW", "ASSIGNED", "COMPLETED", "CANCEL"],
    },
    storeys: {
      type: String,
      required: true,
      enum: ["Single", "Double"],
    },
    bedrooms: {
      type: Number,
      required: true,
      enum: [2, 3, 4, 5, 6],
    },
    bathrooms: {
      type: Number,
      required: true,
      enum: [2, 3, 4],
    },
    garages: {
      type: Number,
      required: true,
      enum: [1, 2],
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    postcode: {
      type: Number,
      required: true,
    },
    postDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      default: Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

schema.virtual("price").get(function () {
  return (
    +this.storeys * 200000 +
    this.bedrooms * 50000 +
    this.bathrooms * 50000 +
    this.garages * 50000
  );
});

const Model = mongoose.model("Order", schema);

module.exports = Model;
