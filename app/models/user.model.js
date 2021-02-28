const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    address: String,
    building: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Building"
        }
    ],
    email: String,
    password: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    tickets: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ticket"
        }
    ],
    unit: String,
    username: String,
  })
);

module.exports = User;