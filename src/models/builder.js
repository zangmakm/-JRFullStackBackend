const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const schema = new mongoose.Schema({
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  abn: {
    type: Number,
    required: true,
    trim: true,
  },
  builderName: {
    type: String,
    required: true,
    trim: true,
  },
  mobile: {
    type: Number,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      //throw error when return false
      validator: (email) => !Joi.string().email().validate(email).error,
      msg: "invalidate email format",
    },
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  postcode: {
    type: Number,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    trim: true,
  },
});
const Model = mongoose.model("Builder", schema);

module.exports = Model;
