const { authJwt } = require('../middlewares');
const controller = require('../controllers/building.controller');

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
  app.get('/api/building/all', controller.getAll);
  // one
  app.get('/api/building', controller.getBuilding);

  // Create
  app.post(
    '/api/building',
    [authJwt.verifyToken, authJwt.isManager],
    controller.create
  );

  // Update
  app.put(
    '/api/building',
    [authJwt.verifyToken, authJwt.isManager],
    controller.update
  );

  // Deletes
  app.delete(
    '/api/building/',
    [authJwt.verifyToken, authJwt.isManager],
    controller.delete
  );
};
