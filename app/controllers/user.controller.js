const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;
const Role = db.role;

exports.getAll = (req, res) => {
  User.find({}).exec((err, users) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (!users[0]) {
      res.status(500).send({ message: 'No users in the DB' });
      return;
    }
    res.status(200).send({ users: users });
  });
};

exports.getAllMaintenance = (req, res) => {
  User.find({})
    .populate('roles')
    .exec((err, users) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!users[0]) {
        res.status(500).send({ message: 'No users in the DB' });
        return;
      }
      let filteredUsers = users.map((user) =>
        user.roles.find((it) => it.name == 'maintenance')
      );
      res.status(200).send({ filteredUsers });
    });
};

exports.getUser = (req, res) => {
  User.find({ _id: req.body.user }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (!ticket) {
      res.status(500).send({ message: 'No buildings ticket in the DB' });
      return;
    }
    res.status(200).send({ user: user });
  });
};

exports.update = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.body.ticket },
    {
      username: req.body.username,
      address: req.body.address,
      createdBy: req.userId,
    },
    (err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send({ message: 'Update Successful' });
    }
  );
};

exports.delete = (req, res) => {
  Ticket.findOneAndDelete({ _id: req.body.ticket }).exec((err, ticket) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send({ message: 'Ticket deleted' });
  });
};
