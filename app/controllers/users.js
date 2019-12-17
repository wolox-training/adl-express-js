const logger = require('../logger');
const usersService = require('../services/users');
const albumsService = require('../services/album');
const credentialsHelper = require('../services/validateCredentials');
const albumsSerializers = require('../serializers/albums');

module.exports.signUp = (req, res, next) =>
  usersService
    .signUp(req.body)
    .then(() => {
      logger.info(`Created user: ${JSON.stringify(req.body.first_name)}`);
      return res.status(201).send({ firstName: req.body.first_name });
    })
    .catch(next);

module.exports.signIn = (req, res, next) =>
  credentialsHelper
    .signIn(req.body)
    .then(token => {
      logger.info(`Sign in with user: ${JSON.stringify(req.body.email)}`);
      res.status(200).send({ response: token });
    })
    .catch(next);

module.exports.index = (req, res, next) =>
  usersService
    .index(req.query.page)
    .then(users => {
      res.status(200).send({ response: users });
    })
    .catch(next);

module.exports.buyAlbum = async (req, res, next) => {
  try {
    const currentUser = await req.currentUser;
    const response = await albumsService.buyAlbum(req.params.id, currentUser);
    logger.info(`Album purchased: ${JSON.stringify(response.dataValues.title)}`);
    return res.status(200).send({ album: response.dataValues });
  } catch (error) {
    return next(error);
  }
};

module.exports.signIn = (req, res, next) => {
  credentialsHelper
    .signIn(req.body)
    .then(token => {
      logger.info(`Sign in with user: ${JSON.stringify(req.body.email)}`);
      res.status(200).send({ response: token });
    })
    .catch(next);
};

module.exports.listAlbums = async (req, res, next) => {
  try {
    const albumsArray = await albumsService.listAlbums(req.params.userId);
    return res.status(200).send({ userAlbums: albumsSerializers.albums(albumsArray) });
  } catch (error) {
    return next(error);
  }
};
