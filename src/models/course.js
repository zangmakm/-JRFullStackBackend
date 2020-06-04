const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 10,
  },
  description: {
    type: String,
    default: "",
  },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
});

const Model = mongoose.model("Course", Schema);
module.exports = Model;
