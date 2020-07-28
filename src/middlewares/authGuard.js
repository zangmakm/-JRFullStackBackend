const { validateToken } = require("../utils/jwt");
const { formatResponse } = require("../utils/helper");

function authGuard(req, res, next) {
  console.log("begin1:");
  const authHeader = req.header("Authorization");
  if (!authHeader) formatResponse(res, "Access Denied", 401);

  const contentArr = authHeader.split(" ");
  if (contentArr.length !== 2 || contentArr[0] !== "Bearer")
    formatResponse(res, "Access Denied", 401);

  const decoded = validateToken(contentArr[1]);
  if (decoded) {
    req.user = decoded;
    return next();
  }
  formatResponse(res, "Access Denied", 401);
}

function authGuardClient(req, res, next) {
  console.log("begin2:");
  const role = req.user.role;
  if (!role === "client") {
    formatResponse(res, "Access Denied", 401);
  }
  return next();
}

function authGuardBuilder(req, res, next) {
  const role = req.user.role;
  if (!role === "builder") {
    formatResponse(res, "Access Denied", 401);
  }
  return next();
}

module.exports = {
  authGuard,
  authGuardClient,
  authGuardBuilder,
};
