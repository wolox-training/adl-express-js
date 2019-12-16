// const controller = require('./controllers/controller');

const { healthCheck } = require('./controllers/healthCheck');
const albumsController = require('./controllers/albums');
const usersController = require('./controllers/users');
const adminController = require('./controllers/admins');
const credentialsMiddleware = require('./middlewares/credentialsValidator');
const authenticationMiddleware = require('./middlewares/checkAuthentication');
const authorizationMiddleware = require('./middlewares/checkAuthorization');

exports.init = app => {
  app.get('/health', healthCheck);
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
  app.get('/albums', albumsController.albums);
  app.get('/albums/:id/photos', albumsController.photos);
  app.post('/users', [credentialsMiddleware.validate], usersController.signUp);
  app.post('/users/sessions', [credentialsMiddleware.validate], usersController.signIn);
  app.post(
    '/admin/users',
    [authenticationMiddleware.validateAdmin, credentialsMiddleware.validate],
    adminController.signUp
  );

  app.get('/users', [authenticationMiddleware.validate], usersController.index);
  app.post('/albums/:id', [authenticationMiddleware.validate], usersController.buy);
  app.get(
    '/users/:userId/albums',
    [authenticationMiddleware.validate, authorizationMiddleware.ownerAdmin],
    usersController.listAlbums
  );
  app.post('/users/sessions/invalidate', [authenticationMiddleware.validate], usersController.invalidateAll);
};
