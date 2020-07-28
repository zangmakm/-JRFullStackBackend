const clientModel = require("../models/client");
const orderModel = require("../models/order");
const userModel = require("../models/user");
const {
  formatResponse,
  convertQuery,
  convertUpdateBody,
} = require("../utils/helper");
const { deleteImage } = require("../utils/upload");

var ObjectID = require("mongodb").ObjectID;

async function getClient(req, res) {
  const { clientId } = req.params;
  const client = await clientModel.findById(clientId);
  if (!client) {
    return formatResponse(res, "Client not found", 404);
  }
  return formatResponse(res, client);
}

async function addClient(req, res) {
  const {
    userId,
    firstName,
    lastName,
    gender,
    mobile,
    email,
    postcode,
    photo,
  } = req.body;
  const client = new clientModel({
    firstName,
    lastName,
    gender,
    mobile,
    email,
    postcode,
    photo,
  });

  const user = await userModel.findById(userId).exec();
  if (user.client) {
    return formatResponse(
      res,
      "Client cannot be registered twice with the same username",
      400
    );
  }
  client.user = userId;
  await client.save();
  user.client = client._id;
  await user.save();
  return formatResponse(res, client);
}

async function updateClient(req, res) {
  const { clientId } = req.params;
  const keys = [
    "firstName",
    "lastName",
    "gender",
    "mobile",
    "email",
    "postcode",
    "photo",
  ];

  const updateClient = await clientModel.updateOne(
    { _id: ObjectID(clientId) },
    { $set: convertUpdateBody(req.body, keys) }
  );

  if (!updateClient) {
    return formatResponse(res, "Client not found", 404);
  }

  return formatResponse(res, updateClient);
}

async function getClientOrders(req, res) {
  const { clientId } = req.params;
  const client = await clientModel.findById(clientId);
  if (!client) {
    return formatResponse(res, "Client not found", 404);
  }

  let search = {};
  if (req.query.status) {
    search = { status: req.query.status };
  }

  const pageNum = Number(req.query.page);
  const pageSize = Number(req.query.pageSize);
  const start = (pageNum - 1) * pageSize;

  const total = await orderModel
    .find({ postBy: ObjectID(clientId) })
    .find(search)
    .countDocuments()
    .exec();

  const { pagination, sort } = convertQuery(req.query, total);

  const orders = await orderModel
    .find({ postBy: ObjectID(clientId) })
    .find(search)
    .sort(sort)
    .skip(start)
    .limit(pageSize)
    .populate("postBy")
    .exec();

  return formatResponse(res, { data: orders, pagination });
}

async function updateAvatar(req, res) {
  const { clientId } = req.params;
  console.log("req.file:", req.file);
  if (!req.file) {
    return formatResponse(res, "Image missing", 400);
  }
  const client = await clientModel.findById(clientId).exec();
  console.log("client:", client);
  if (!client) {
    await deleteImage(req.file.key);
    return formatResponse(res, "Client not found", 404);
  }
  if (!client.user || client.user._id.toString() !== req.user.id) {
    await deleteImage(req.file.key);
    return formatResponse(res, "Access denied", 401);
  }
  console.log("client.user._id:", client.user._id);
  console.log("req.user.id:", req.user.id);
  client.photo = req.file.location;
  console.log("client.photo:", req.file.location);
  await clientModel.save();

  return formatResponse(res, client.photo, 200);
}

module.exports = {
  getClient,
  addClient,
  updateClient,
  getClientOrders,
  updateAvatar,
};
