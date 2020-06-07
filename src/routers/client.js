const express = require("express");
const router = express.Router();
const {
  getAllClients,
  getClient,
  addClient,
} = require("../controllers/client");
//get all
router.get("/", getAllClients);
//get specified client
router.get("/:clientId", getClient);
//add new client
router.post("/", addClient);
//cancel client

module.exports = router;
