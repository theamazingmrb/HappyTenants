const mongoose = require("mongoose");

const Building = mongoose.model(
  "Building",
  new mongoose.Schema({
    description: String,
    image: String,
    name: String,
    tenants: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tenant"
        }
    ],
    units: [],
    manager: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
    ],
  })
);

module.exports = Building;