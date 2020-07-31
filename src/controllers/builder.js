const builderModel = require("../models/builder");
const orderModel = require("../models/order");
const userModel = require("../models/user");
const {
  formatResponse,
  convertQuery,
  convertUpdateBody,
} = require("../utils/helper");
const { deleteImage } = require("../utils/upload");

var ObjectID = require("mongodb").ObjectID;

async function getAllBuilders(req, res) {
  const builders = await builderModel.find().populate("comments").exec();
  return formatResponse(res, builders);
}

async function getBuilder(req, res) {
  const { builderId } = req.params;
  const builder = await builderModel
    .findById(builderId)
    .populate("comments")
    .exec();
  if (!builder) {
    return formatResponse(res, "Builder not found", 404);
  }
  res.json(builder);
}

async function addBuilder(req, res) {
  const {
    userId,
    abn,
    builderName,
    mobile,
    email,
    address,
    postcode,
    photo,
    description,
  } = req.body;
  const builder = new builderModel({
    abn,
    builderName,
    mobile,
    email,
    address,
    postcode,
    photo,
    description,
  });

  const user = await userModel.findById(userId).exec();
  if (user.builder) {
    return formatResponse(
      res,
      "Builder cannot be registered twice with the same username",
      400
    );
  }
  builder.user = userId;
  await builder.save();
  user.builder = builder._id;
  await user.save();
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
    "photo",
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
    .populate("postBy takenBy")
    .exec();

  return formatResponse(res, { data: orders, pagination });
}

async function updateAvatar(req, res) {
  const { builderId } = req.params;

  if (!req.file) {
    return formatResponse(res, "Image missing", 400);
  }
  const builder = await builderModel.findById(builderId).exec();

  if (!builder) {
    await deleteImage(req.file.key);
    return formatResponse(res, "Builder not found", 404);
  }
  if (!builder.user || builder.user._id.toString() !== req.user.id) {
    await deleteImage(req.file.key);
    return formatResponse(res, "Access denied", 401);
  }

  builder.photo = req.file.location;
  await builder.save();

  return formatResponse(res, builder.photo, 200);
}

module.exports = {
  getAllBuilders,
  getBuilder,
  addBuilder,
  updateBuilder,
  getBuilderOrders,
  updateAvatar,
};
