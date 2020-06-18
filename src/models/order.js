const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    postBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    takenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Builder",
    },
    comments: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    status: {
      type: String,
      required: true,
      default: "NEW",
      enum: ["NEW", "ASSIGNED", "COMPLETED", "CANCEL_CLIENT", "CANCEL_BUILDER"],
    },
    storeys: {
      type: Number,
      required: true,
      enum: [1, 2],
    },
    bedrooms: {
      type: Number,
      required: true,
      enum: [2, 3, 4, 5, 6],
    },
    bathrooms: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4],
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
    postDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      default: Date(Date.now() + 604800000),
      //default: Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    },
    description: {
      type: String,
      trim: true,
    },
    star: {
      type: Number,
    },
    comment: {
      type: String,
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
