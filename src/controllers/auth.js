const User = require("../models/user");
const { generateToken } = require("../utils/jwt");

async function loginUser(req, res) {
  const { username, password } = req.body;
  const exitornot = await User.findOne({ username }).exec();
  if (!exitornot) {
    return res.status(404).json("username is not correct");
  }
  const validatePassword = await exitornot.validatePassword(password);
  if (!validatePassword) {
    return res.status(404).json("password is not correct");
  }

  const token = generateToken(exitornot._id);
  return res.json({ username, token });
}

module.exports = {
  loginUser,
};
