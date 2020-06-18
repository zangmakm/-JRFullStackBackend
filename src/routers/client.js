const express = require("express");
const router = express.Router();
const {
  getClient,
  addClient,
  updateClient,
  getClientOrders,
} = require("../controllers/client");

//get specified client
router.get("/:clientId", getClient);
//add new client
router.post("/", addClient);
//update client order
router.put("/:clientId", updateClient);
//get client orders by status
router.get("/:clientId/orders", getClientOrders);

module.exports = router;
