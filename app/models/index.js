const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.building = require("./building.model");
db.role = require("./role.model");
db.ticket = require("./ticket.model");
db.user = require("./user.model");

db.ROLES = ["manager", "tenant", "maintenance"];

module.exports = db;