const builderModel = require("../models/builder");
const orderModel = require("../models/order");
const {
  formatResponse,
  convertQuery,
  convertUpdateBody,
} = require("../utils/helper");

var ObjectID = require("mongodb").ObjectID;

async function getAllBuilders(req, res) {
  const builders = await builderModel.find().populate("comments").exec();
  return formatResponse(res, builders);
}

async function getBuilder(req, res) {
  const { builderId } = req.params;
  const builder = await builderModel.findById(builderId);
  if (!builder) {
    return formatResponse(res, "Builder not found", 404);
  }
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
  return formatResponse(res, builder);
}

async function updateBuilder(req, res) {
  const { builderId } = req.params;
  const keys = [
    "abn",
    "builderName",
    "mobile",
    "email",
    "address",
    "postcode",
    "description",
  ];

  const updateBuilder = await builderModel.updateOne(
    { _id: ObjectID(builderId) },
    { $set: convertUpdateBody(req.body, keys) }
  );

  if (!updateBuilder) {
    return formatResponse(res, "Builder not found", 404);
  }

  return formatResponse(res, updateBuilder);
}

async function getBuilderOrders(req, res) {
  const { builderId } = req.params;
  const builder = await builderModel.findById(builderId);
  if (!builder) {
    return formatResponse(res, "Builder not found", 404);
  }

  let search = {};
  if (req.query.status) {
    search = { status: req.query.status };
  }

  const pageNum = Number(req.query.page);
  const pageSize = Number(req.query.pageSize);
  const start = (pageNum - 1) * pageSize;

  const total = await orderModel
    .find({ takenBy: ObjectID(builderId) })
    .find(search)
    .countDocuments()
    .exec();

  const { pagination, sort } = convertQuery(req.query, total);

  const orders = await orderModel
    .find({ takenBy: ObjectID(builderId) })
    .find(search)
    .sort(sort)
    .skip(start)
    .limit(pageSize)
    .populate("takenBy")
    .exec();

  return formatResponse(res, { data: orders, pagination });
}

module.exports = {
  getAllBuilders,
  getBuilder,
  addBuilder,
  updateBuilder,
  getBuilderOrders,
};
