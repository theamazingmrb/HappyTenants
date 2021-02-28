const mongoose = require("mongoose");

const Ticket = mongoose.model(
  "Ticket",
  new mongoose.Schema({
      building: [
          {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Building"
            }
        ],
    description: String,
    image: String,
    maintenance: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    maintenanceNotes: [],
    tenant: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    tenantNotes: []
  })
);

module.exports = Ticket;