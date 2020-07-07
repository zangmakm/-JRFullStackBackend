const userModel = require("../models/user");
const { generateToken } = require("../utils/jwt");
const { formatResponse } = require("../utils/helper");

async function addUser(req, res) {
  const { username, password, role } = req.body;
  const existingUser = await userModel.findOne({ username }).exec();
  if (existingUser) {
    return formatResponse(res, "User already exist", 404);
  }

  const user = new userModel({
    username,
    password,
    role,
  });

  await user.hashPassword();
  await user.save();
  const token = generateToken({ id: user._id, role: user.role });

  return formatResponse(
    res,
    {
      userId: user._id,
      userName: user.username,
      userRole: user.role,
      token,
    },
    201
  );
}

async function updateUser(req, res) {
  const { userId } = req.params;
  const { oldPassword, newPassword, doublePassword } = req.body;
  const existingUser = await userModel.findById(userId).exec();
  if (!existingUser) {
    return formatResponse(res, "user not found", 404);
  }
  if (!(await existingUser.validatePassword(oldPassword))) {
    return formatResponse(res, "Invalid old password", 400);
  }
  if (!newPassword || !doublePassword || newPassword !== doublePassword) {
    return formatResponse(
      res,
      "New passwords and old password inconsistent.",
      400
    );
  }
  existingUser.password = newPassword;
  await existingUser.hashPassword();
  await existingUser.save();
  const token = generateToken({
    id: existingUser._id,
    role: existingUser.role,
  });
  return formatResponse(
    res,
    {
      userName: existingUser.username,
      userRole: existingUser.role,
      token,
    },
    201
  );
}

async function getSelf(req, res) {
  const user = await userModel.findById(req.user.id);
  return formatResponse(res, user);
}

module.exports = {
  addUser,
  updateUser,
  getSelf,
};
