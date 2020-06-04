module.exports = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json(`validator error ${err.message}`);
  }
  console.log(err);
  return res.status(500).json("cuo de");
};
