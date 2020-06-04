const User = require("../models/user");
const { generateToken } = require("../utils/jwt");

async function addUser(req, res) {
  const { username, password } = req.body;
  const exitornot = await User.findOne({ username }).exec();
  if (exitornot) {
    return res.status(404).json("username exit");
  }
  const user = new User({
    username,
    password,
  });
  await user.hashPassword();
  await user.save();
  const token = generateToken(user._id);
  return res.json({ username, token });
}

module.exports = {
  addUser,
};
