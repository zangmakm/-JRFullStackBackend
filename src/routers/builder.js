const express = require("express");
const router = express.Router();
const {
  getAllBuilders,
  getBuilder,
  addBuilder,
  updateBuilder,
  getBuilderOrders,
} = require("../controllers/builder");
//get all
router.get("/", getAllBuilders);
//get specified builder
router.get("/:builderId", getBuilder);
//add new builder
router.post("/", addBuilder);
//update client order
router.put("/:builderId", updateBuilder);
//get client orders by status
router.get("/:builderId/orders", getBuilderOrders);

module.exports = router;
