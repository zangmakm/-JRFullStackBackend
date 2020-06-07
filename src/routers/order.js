const express = require("express");
const router = express.Router();
const { getAllOrders, getOrder, addOrder } = require("../controllers/order");
//get all
router.get("/", getAllOrders);
//get specified order
router.get("/:orderId", getOrder);
//add new order
router.post("/", addOrder);
//cancel order
//router.put("/:id", updateOrder);

module.exports = router;
