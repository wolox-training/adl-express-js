// const controller = require('./controllers/controller');

const { healthCheck } = require('./controllers/healthCheck');
const albumsController = require('./controllers/albums');
const usersController = require('./controllers/users');
const signUpMiddleware = require('./middlewares/signUp');

exports.init = app => {
  app.get('/health', healthCheck);
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
  app.get('/albums', albumsController.albums);
  app.get('/albums/:id/photos', albumsController.photos);
  app.post('/users', [signUpMiddleware.validate], usersController.signUp);
};
