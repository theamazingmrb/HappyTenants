const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;
const Ticket = db.ticket;

exports.getAll = (req, res) => {
  console.log(req);
  Ticket.find({}).exec((err, tickets) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (!tickets[0]) {
      res.status(200).send({ message: 'No tickets in the DB' });
      return;
    }
    console.log(tickets);
    res.status(200).send({ tickets: tickets });
  });
};

exports.create = (req, res) => {
  console.log('Test works');
};
exports.createTicket = (req, res) => {
  console.log(req);
  const ticket = new Ticket({
    building: req.body.building,
    createdBy: req.userId,
    description: req.body.description,
    status: 'NEW',
    tenantContact: req.body.tenantContact,
    tenantNotes: req.body.tenantNotes,
    unit: req.body.unit,
    maintenanceWindow: {
      start: req.body.start,
      end: req.body.end,
    },
  });

  ticket.save((err, ticket) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    User.findOne({
      _id: req.userId,
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      console.log(user);
      user.tickets.addToSet(ticket);
      user.save((err, user) => {
        if (err) {
          res
            .status(400)
            .send({ message: 'Failed! Could not add ticket to User!' });
          return;
        }
        res
          .status(200)
          .send({ message: 'Success', user: user, ticket: ticket });
      });
    });
  });
};

exports.getTicket = (req, res) => {
  Ticket.find({ _id: req.body.building }).exec((err, ticket) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (!ticket) {
      res.status(500).send({ message: 'No buildings ticket in the DB' });
      return;
    }
    res.status(200).send({ ticket: ticket });
  });
};

exports.update = (req, res) => {
  Ticket.findByIdAndUpdate(
    { _id: req.body.ticket },
    {
      building: req.body.building,
      description: req.body.description,
      tenant: req.body.tenant,
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
  Ticket.findOneAndDelete({ _id: req.params.ticketId }).exec((err, ticket) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send({ message: 'Ticket deleted' });
  });
};
