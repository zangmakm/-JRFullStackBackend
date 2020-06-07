const clientModel = require("../models/client");
const orderModel = require("../models/order");

async function getAllClients(req, res) {
  const clients = await clientModel.find();
  res.json(clients);
}

async function getClient(req, res) {
  const { clientId } = req.params;
  const client = await clientModel.findById(clientId);
  res.json(client);
}
async function addClient(req, res) {
  const { firstName, lastName, gender, mobile, email, postcode } = req.body;
  const client = new clientModel({
    firstName,
    lastName,
    gender,
    mobile,
    email,
    postcode,
  });
  await client.save();
  return res.status(201).json(client);
}

module.exports = {
  getAllClients,
  getClient,
  addClient,
};
