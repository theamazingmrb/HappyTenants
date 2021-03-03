const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Ticket = db.ticket;

exports.create = (req, res) => {
  const ticket = new Ticket({
    building: req.body.building,
    description: req.body.description,
    tenant: req.body.tenant,
    createdBy: req.userId
  });

  ticket.save((err, building) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    User.findOne({
        _id: req.userId
      }).exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        console.log(user)
        user.tickets.addToSet(ticket)
        user.save((err, user) => {
            if (err) {
                res.status(400).send({ message: "Failed! Could not add ticket to User!" });
                return;
              }
              res.status(200).send({ message: "Success", user: user, ticket: ticket });

        })
    })
        })   
}

exports.getAll = (req, res) => {
    Ticket.find({}).exec((err, tickets) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (!tickets[0]) {
            res.status(500).send({ message: "No buildings tickets in the DB" });
            return;
          }
          res.status(200).send({  tickets: tickets });
    })
}

exports.getTicket = (req, res) => {
    Ticket.find({_id: req.body.building}).exec((err, ticket) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (!ticket) {
            res.status(500).send({ message: "No buildings ticket in the DB" });
            return;
        }
        res.status(200).send({  ticket: ticket });
    })
}

exports.update = (req, res) => {
    Ticket.findByIdAndUpdate(
        {_id: req.body.ticket}, 
        { 
            building: req.body.building,
            description: req.body.description,
            tenant: req.body.tenant,
            createdBy: req.userId
        },
        (err)=> {
            if (err) {
                res.status(500).send({ message: err });
                return;
              }
              res.status(200).send({ message: "Update Successful"})
        }
    )
}

exports.delete = (req, res) => {
    Ticket.findOneAndDelete({_id: req.body.ticket}).exec((err, ticket) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.status(200).send({  message: "Ticket deleted" });
    })
}
