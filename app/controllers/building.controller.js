const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Building = db.building;

exports.create = (req, res) => {
  const building = new Building({
    name: req.body.name,
    description: req.body.description,
    units: req.body.units,
    manager: req.userId
  });

building.save((err, building) => {
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
        user.building = [...user.building, building]
        user.save((err, user) => {
            if (err) {
                res.status(400).send({ message: "Failed! Could not add Building to Manger!" });
                return;
              }
              res.status(200).send({ message: "Success", user: user, bulding: building });

        })
    })
        })   
}

exports.getAll = (req, res) => {
    Building.find({}).exec((err, buildings) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (!buildings[0]) {
            res.status(500).send({ message: "No buildings Currents in the DB" });
            return;
          }
          res.status(200).send({  buildings: buildings });
    })
}

exports.getBuilding = (req, res) => {
    Building.find({_id: req.body.building}).exec((err, building) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        console.log(building)
        if (!building) {
            res.status(500).send({ message: "No buildings Currents in the DB" });
            return;
        }
        res.status(200).send({  building: building });
    })
}

exports.update = (req, res) => {
    console.log("In the update", req.body)
    Building.findByIdAndUpdate(
        {_id: req.body.building}, 
        { 
            building: req.body.building, 
            description: req.body.description,
            name: req.body.name,
            units: req.body.units
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
    Building.findOneAndDelete({_id: req.body.building}).exec((err, building) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.status(200).send({  message: "Building deleted" });
    })
}
