const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  star: {
    type: Number,
    default: 3,
  },
  comment: {
    type: String,
    require: true,
  },
  postDate: {
    type: Date,
    default: Date.now,
  },
  clientName: {
    type: String,
  },
  clientPhoto: {
    type: String,
  },
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  builder: { type: mongoose.Schema.Types.ObjectId, ref: "Builder" },
});

const Model = mongoose.model("Comment", schema);

module.exports = Model;
