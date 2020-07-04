const express = require("express");
const router = express.Router();
const {
  getAllBuilders,
  getBuilder,
  addBuilder,
  updateBuilder,
  getBuilderOrders,
} = require("../controllers/builder");
const { authGuard, authGuardBuilder } = require("../middlewares/authGuard");
//get all
router.get("/", getAllBuilders);
//get specified builder
router.get("/:builderId", authGuard, authGuardBuilder, getBuilder);
//add new builder
router.post("/", authGuard, addBuilder);
//update client order
router.put("/:builderId", authGuard, authGuardBuilder, updateBuilder);
//get client orders by status
router.get("/:builderId/orders", authGuard, authGuardBuilder, getBuilderOrders);

module.exports = router;
