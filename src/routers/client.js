const express = require("express");
const router = express.Router();
const {
  getClient,
  addClient,
  updateClient,
  getClientOrders,
  updateAvatar,
} = require("../controllers/client");
const { authGuard, authGuardClient } = require("../middlewares/authGuard");
const { uploadImage } = require("../utils/upload");

//get specified client
router.get("/:clientId", authGuard, getClient);
//add new client
router.post("/", authGuard, addClient);
//update client order
router.put("/:clientId", authGuard, authGuardClient, updateClient);
//get client orders by status
router.get("/:clientId/orders", authGuard, authGuardClient, getClientOrders);
//upload avatar again
router.put(
  "/:clientId/avatar",
  authGuard,
  authGuardClient,
  uploadImage("avatar"),
  updateAvatar
);

module.exports = router;
