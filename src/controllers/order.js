const orderModel = require("../models/order");
const clientModel = require("../models/client");
const builderModel = require("../models/builder");
const commentModel = require("../models/comment");

const {
  convertQuery,
  convertUpdateBody,
  formatResponse,
} = require("../utils/helper");

var ObjectID = require("mongodb").ObjectID;

async function getAllNewOrders(req, res) {
  const pageNum = Number(req.query.page);
  const pageSize = Number(req.query.pageSize);

  const total = await orderModel.find({ status: "NEW" }).countDocuments();
  const start = (pageNum - 1) * pageSize;

  const { pagination, sort } = convertQuery(req.query, total);
  const orders = await orderModel
    .find({ status: "NEW" })
    .sort(sort)
    .skip(start)
    .limit(pageSize)
    .populate("postBy")
    .exec();

  return formatResponse(res, { data: orders, pagination });
}

async function getOrder(req, res) {
  const { orderId } = req.params;
  const order = await orderModel
    .findById(orderId)
    .populate("postBy takenBy")
    .exec();
  return formatResponse(res, order);
}

async function addOrder(req, res) {
  const {
    storeys,
    bedrooms,
    bathrooms,
    garages,
    address,
    postDate,
    dueDate,
    description,
  } = req.body;

  const { clientId } = req.query;

  const order = new orderModel({
    storeys,
    bedrooms,
    bathrooms,
    garages,
    address,
    postDate,
    dueDate,
    description,
  });
  const client = await clientModel.findById(clientId).exec();
  if (!client) {
    return formatResponse(res, "Client not found", 404);
  }
  order.postBy = clientId;
  await order.save();
  client.orders.addToSet(order._id);
  await client.save();
  //console.log(order);
  return formatResponse(res, order);
}

async function updateOrder(req, res) {
  const { orderId } = req.params;

  const keys = [
    "storeys",
    "bedrooms",
    "bathrooms",
    "garages",
    "address",
    "postDate",
    "dueDate",
    "description",
  ];

  const updateOrder = await orderModel.updateOne(
    { _id: ObjectID(orderId) },
    { $set: convertUpdateBody(req.body, keys) }
  );

  if (!updateOrder) {
    return formatResponse(res, "Order not found", 404);
  }

  return formatResponse(res, updateOrder);
}

async function updateClientOrderStatus(req, res) {
  const { orderId, clientId } = req.params;
  const { status } = req.query;
  const order = await orderModel.findById(orderId).exec();

  if (!order) {
    return formatResponse(res, "Order not found", 404);
  }
  if (
    (order.status === "NEW" && status === "CANCEL_CLIENT") ||
    (order.status === "ASSIGNED" && status === "COMPLETED")
  ) {
    order.status = status;
    await order.save();
    return formatResponse(res, order);
  } else {
    return formatResponse(res, "Cannot change order status", 200);
  }
}

async function updateBuilderOrderStatus(req, res) {
  const { orderId, builderId } = req.params;
  const { status } = req.query;
  console.log("orderId:", orderId);
  console.log("builderId:", builderId, status);
  console.log("status:", status);
  const order = await orderModel.findById(orderId).populate("takenBy").exec();
  if (!order) {
    return formatResponse(res, "Order not found", 404);
  }
  console.log("order:", order);
  const builder = await builderModel.findById(builderId).exec();
  if (!builder) {
    return formatResponse(res, "builder not found", 404);
  }
  console.log("builder:", builder);
  if (order.status === "NEW" && status === "ASSIGNED") {
    builder.orders.addToSet(order._id);
    console.log("builder.orders:", builder.orders);
    order.takenBy = builderId;
    order.status = status;
    await order.save();
    await builder.save();
    return formatResponse(res, order);
  } else if (order.status === "ASSIGNED" && status === "CANCEL_BUILDER") {
    order.status = status;
    await order.save();
    return formatResponse(res, order);
  } else {
    return formatResponse(res, "Cannot change order status", 200);
  }
}

async function addOrderComment(req, res) {
  const { orderId } = req.params;
  const { star, comments } = req.body;

  const order = await orderModel
    .findById(orderId)
    .populate("postBy", "firstName lastName")
    .exec();
  if (!order) {
    return formatResponse(res, "Order not found", 404);
  }
  if (order.status !== DONE) {
    return formatResponse(res, "Order not finish yet", 400);
  }
  order.star = star;
  order.comment = comments;
  await order.save();

  const clientFullName = `${order.postBy.firstName} ${order.postBy.lastName}`;
  const comment = new commentModel({
    star: star,
    comment: comments,
    clientName: clientFullName,
    order: order._id,
    builder: order.takenBy,
  });

  await comment.save();

  const commentId = comment._id;
  const builderId = order.takenBy;
  const builder = await builderModel.findById(builderId).exec();

  if (!builder) {
    return formatResponse(res, "Builder not found", builder);
  }

  builder.comments.addToSet(commentId);
  await builder.save();

  return formatResponse(res, comment);
}

module.exports = {
  getAllNewOrders,
  getOrder,
  addOrder,
  updateOrder,
  updateClientOrderStatus,
  updateBuilderOrderStatus,
  addOrderComment,
};
