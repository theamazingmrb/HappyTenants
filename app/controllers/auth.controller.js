const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;
const Role = db.role;
const Building = db.building;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    building: req.body.building,
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    // if user is a tenant add tenant to building
    if (req.body.roles.includes('tenant')) {
      Building.findByIdAndUpdate({ _id: req.body.building }).then(
        (building) => {
          building.tenants.addToSet(user._id);
          building.save((err) => {
            if (err) {
              res.status(500).send({
                message: err,
              });
            }
          });
        }
      );
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            var token = jwt.sign({ id: user.id }, config.secret, {
              expiresIn: 86400, // 24 hours
            });

            let authorities = roles.map(
              (role) => `ROLE_${role.name.toUpperCase()}`
            );

            res.send({
              message: 'User was registered successfully!',
              status: 'ok',
              username: user.username,
              id: user._id,
              email: user.email,
              roles: authorities,
              accessToken: token,
            });
          });
        }
      );
    } else {
      Role.findOne({ name: 'tenant' }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: 'User was registered successfully!' });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate('roles', '-__v')
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password!',
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      let authorities = user.roles.map(
        (role) => `ROLE_${role.name.toUpperCase()}`
      );
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      });
    });
};
