const logger = require('../logger');
const usersService = require('../services/users');
const albumsService = require('../services/album');
const credentialsHelper = require('../services/validateCredentials');

module.exports.signUp = (req, res, next) =>
  usersService
    .signUp(req.body)
    .then(() => {
      logger.info(`Created user: ${JSON.stringify(req.body.firstName)}`);
      return res.status(201).send({ firstName: req.body.firstName });
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

module.exports.buy = async (req, res, next) => {
  try {
    const currentUser = await req.currentUser;
    const response = await albumsService.buy(req.params.id, currentUser);
    res.status(200).send({ album: response.dataValues });
  } catch (e) {
    return next(e);
  }

  return next;
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
