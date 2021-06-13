const { authJwt } = require('../middlewares');
const controller = require('../controllers/ticket.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  // GET
  // all
  app.get('/api/ticket/all', controller.getAll);
  // one
  // app.get('/api/ticket', controller.getTicket);

  // Create
  app.post('/api/ticket', [authJwt.verifyToken], controller.createTicket);

  // Update
  app.put('/api/ticket', [authJwt.verifyToken], controller.update);

  // // Deletes
  app.delete('/api/ticket/:ticketId', [authJwt.verifyToken], controller.delete);
};
