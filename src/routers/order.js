const express = require("express");
const router = express.Router();
const {
  getAllNewOrders,
  getOrder,
  addOrder,
  updateOrder,
  updateClientOrderStatus,
  updateBuilderOrderStatus,
  addOrderComment,
} = require("../controllers/order");

//get all new orders for builder
router.get("/", getAllNewOrders);
//get specified order
router.get("/:orderId", getOrder);
//add new order
router.post("/", addOrder);
//update order
//orderId?XXXXX
router.put("/:orderId", updateOrder);
//update client's order status
//status?COMPLETED
router.patch("/:orderId/client/:clientId", updateClientOrderStatus);
//update client's order status
//status?COMPLETED
router.patch("/:orderId/builder/:builderId", updateBuilderOrderStatus);
//add comment of client's order
router.post("/:orderId/comment", addOrderComment);

module.exports = router;
