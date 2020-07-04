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
  authGuard,
  authGuardClient,
  authGuardBuilder,
} = require("../middlewares/authGuard");

//get all new orders for builder
router.get("/", authGuard, authGuardBuilder, getAllNewOrders);
//get specified order
router.get("/:orderId", authGuard, getOrder);
//add new order
router.post("/", authGuard, authGuardClient, addOrder);
//update order
//orderId?XXXXX
router.put("/:orderId", authGuard, authGuardClient, updateOrder);
//update client's order status
//status?COMPLETED
router.patch(
  "/:orderId/client/:clientId",
  authGuard,
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
