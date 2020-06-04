const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  courses: [{ type: String, ref: "Course" }],
});

const Model = mongoose.model("Student", Schema);
module.exports = Model;
