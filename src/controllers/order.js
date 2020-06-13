const orderModel = require("../models/order");
const clientModel = require("../models/client");
const builderModel = require("../models/builder");
const {
    convertUpdateBody,
    formatResponse
  } = require('../utils/helper');

var ObjectID = require('mongodb').ObjectID;

async function getAllOrders(req, res) {
  const orders = await orderModel.find({ status: "NEW" });
  res.json(orders);
}

async function getOrder(req, res) {
  const { orderId } = req.params;
  const order = await orderModel.findById(orderId).exec();
  res.json(order);
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
        description
    } = req.body;

    const {clientId} = req.query;

    const order = new orderModel({
        storeys,
        bedrooms,
        bathrooms,
        garages,
        address,
        postDate,
        dueDate,
        description
    });
    const client = await clientModel.findById(clientId).exec();
    if (!client) {
        return res.status(404).json("client not found");
    }
    order.postBy = clientId;
    await order.save();
    client.orders.addToSet(order._id);
    await client.save();
    //console.log(order);
    return res.json(order);
}

async function updateOrder(req,res) {
    const {orderId} = req.params;

    const keys = ['storeys', 
                'bedrooms',
                'bathrooms', 
                'garages',
                'address', 
                'postDate',
                'dueDate', 
                'description'];

    const updateOrder = await orderModel.updateOne(
        {"_id": ObjectID(orderId)}, 
        { $set: convertUpdateBody(req.body, keys)}, 
    );

    if (!updateOrder) {
        return formatResponse(res, 404, 'Order not found', null);
      }
    
      return formatResponse(res, 200, null, updateOrder);

}

async function updateClientOrderStatus(req,res) {
    const{orderId, clientId} = req.params;
    const{status} = req.query;
    const order = await orderModel.findById(orderId).exec();
    
    if(!order){
        return formatResponse(res, 'Order not found', 404);
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

async function updateBuilderOrderStatus(req,res) {
    const{orderId, builderId} = req.params;
    const{status} = req.query;

    const order = await orderModel.findById(orderId).exec();
    if(!order){
        return formatResponse(res, 'Order not found', 404);
    }

    const builder = await builderModel.findById(builderId).exec();
    if(!builder){
        return formatResponse(res, 'builder not found', 404);
    }

    if (order.status === "NEW" && status === "ASSIGNED") {
        builder.orders.addToSet(order._id);
        await builder.save();
        order.takenBy = builderId;
        order.status = status;
        await order.save();
        return formatResponse(res, order);
    } else if (order.status === "ASSIGNED" && status === "CANCEL_BUILDER"){
        order.status = status;
        await order.save();
        return formatResponse(res, order);
    } else {
        return formatResponse(res, "Cannot change order status", 200);
    }
}

module.exports = {
  getAllOrders,
  getOrder,
  addOrder,
  updateOrder,
  updateClientOrderStatus,
  updateBuilderOrderStatus
};
