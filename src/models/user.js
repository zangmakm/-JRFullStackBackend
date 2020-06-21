const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  builder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Builder",
  },
  role: {
    type: String,
    required: true,
    enum: ["client", "builder"],
  },
});

schema.methods.hashPassword = async function () {
  this.password = await bcrypt.hash(this.password, 12);
};

schema.methods.validatePassword = async function (password) {
  const validPassword = await bcrypt.compare(password, this.password);
  return validPassword;
};

const Model = mongoose.model("User", schema);
module.exports = Model;
