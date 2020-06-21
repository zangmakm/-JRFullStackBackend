const User = require("../models/user");
const { generateToken } = require("../utils/jwt");
const { formatResponse } = require("../utils/helper");

async function loginUser(req, res) {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username }).exec();
  if (!existingUser) {
    return formatResponse(res, "Invalidate username or password.", 404);
  }
  const validatePassword = await existingUser.validatePassword(password);
  if (!validatePassword) {
    return formatResponse(res, "Invalidate username or password.", 404);
  }

  const token = generateToken({
    id: existingUser._id,
    role: existingUser.role,
  });

  return formatResponse(res, {
    userId: existingUser._id,
    userName: existingUser.username,
    userRole: existingUser.role,
    token,
    clientId: existingUser.client,
    builderId: existingUser.builder,
  });
}

module.exports = {
  loginUser,
};
