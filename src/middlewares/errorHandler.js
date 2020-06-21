const { formatResponse } = require("../utils/helper");

module.exports = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    formatResponse(res, err.message, 400);
  }
  if (err.type === "entity.parse.failed") {
    formatResponse(res, err.message, 400);
  }

  console.log(err.message);
  formatResponse(res, `something unexpected happened: ${err.message}`, 500);
};
