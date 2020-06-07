const builderModel = require("../models/builder");
const orderModel = require("../models/order");

async function getAllBuilders(req, res) {
  const builders = await builderModel.find();
  res.json(builders);
}

async function getBuilder(req, res) {
  const { builderId } = req.params;
  const builder = await builderModel.findById(builderId);
  res.json(builder);
}
async function addBuilder(req, res) {
  const {
    abn,
    builderName,
    mobile,
    email,
    address,
    postcode,
    description,
  } = req.body;
  const builder = new builderModel({
    abn,
    builderName,
    mobile,
    email,
    address,
    postcode,
    description,
  });
  await builder.save();
  return res.status(201).json(builder);
}

module.exports = {
  getAllBuilders,
  getBuilder,
  addBuilder,
};
