const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const schema = new mongoose.Schema(
  {
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: Number,
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
    postcode: {
      type: Number,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    photo: {
      type: String,
      default:
        "https://www.lightningdesignsystem.com/assets/images/avatar2.jpg",
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);
schema.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});

const Model = mongoose.model("Client", schema);

module.exports = Model;
