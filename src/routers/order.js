const express = require("express");
const router = express.Router();
const { getAllOrders, 
    getOrder, 
    addOrder, 
    updateOrder, 
    updateClientOrderStatus,
    updateBuilderOrderStatus } = require("../controllers/order");
    
//get all
router.get("/", getAllOrders);
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

module.exports = router;
