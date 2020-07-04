const express = require("express");
const router = express.Router();
const {
  getClient,
  addClient,
  updateClient,
  getClientOrders,
} = require("../controllers/client");
const { authGuard, authGuardClient } = require("../middlewares/authGuard");

//get specified client
router.get("/:clientId", authGuard, getClient);
//add new client
router.post("/", authGuard, addClient);
//update client order
router.put("/:clientId", authGuard, authGuardClient, updateClient);
//get client orders by status
router.get("/:clientId/orders", authGuard, authGuardClient, getClientOrders);

module.exports = router;
