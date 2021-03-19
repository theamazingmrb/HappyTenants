const mongoose = require('mongoose');

const Ticket = mongoose.model(
  'Ticket',
  new mongoose.Schema({
    building: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building',
      },
    ],
    createdBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    description: String,
    image: String,
    maintenance: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    maintenanceNotes: [],
    maintenanceWindow: {},
    status: String,
    tenant: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    tenantContact: String,
    tenantNotes: [],
    unit: String,
  })
);

module.exports = Ticket;
