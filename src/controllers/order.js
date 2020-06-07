const orderModel = require("../models/order");
const clientModel = require("../models/client");

async function getAllOrders(req, res) {
  const orders = await orderModel.find({ status: "NEW" });
  res.json(orders);
}

async function getOrder(req, res) {
  const { orderId } = req.params;
  const order = await orderModel.findById(orderId);
  res.json(order);
}

async function addOrder(req, res) {
  const { storeys, bedrooms, bathrooms, garages, address, postcode } = req.body;
  const clientId = req.query.clientId;
  console.log(clientId);
  const order = new orderModel({
    storeys,
    bedrooms,
    bathrooms,
    garages,
    address,
    postcode,
  });
  const client = await clientModel.findById(clientId).exec();
  if (!client) {
    return res.status(404).json("client not found");
  }
  order.postBy = clientId;
  await order.save();
  client.orders.addToSet(order._id);
  await client.save();

  return res.json(order);
}

module.exports = {
  getAllOrders,
  getOrder,
  addOrder,
};
