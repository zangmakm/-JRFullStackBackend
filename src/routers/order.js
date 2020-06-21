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
const {
  authGuardClient,
  authGuardBuilder,
} = require("../middlewares/authGuard");

//get all new orders for builder
router.get("/", authGuardBuilder, getAllNewOrders);
//get specified order
router.get("/:orderId", getOrder);
//add new order
router.post("/", authGuardClient, addOrder);
//update order
//orderId?XXXXX
router.put("/:orderId", authGuardClient, updateOrder);
//update client's order status
//status?COMPLETED
router.patch(
  "/:orderId/client/:clientId",
  authGuardClient,
  updateClientOrderStatus
);
//update client's order status
//status?COMPLETED
router.patch(
  "/:orderId/builder/:builderId",
  authGuardBuilder,
  updateBuilderOrderStatus
);
//add comment of client's order
router.post("/:orderId/comment", authGuardClient, addOrderComment);

module.exports = router;
