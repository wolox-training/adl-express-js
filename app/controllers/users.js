const logger = require('../logger');
const usersService = require('../services/users');
const credentialsHelper = require('../helpers/users/validate_credentials');
const models = require('../models/index');

module.exports.signUp = (req, res, next) =>
  usersService
    .signUp(req.body)
    .then(() => {
      logger.info(`Created user: ${JSON.stringify(req.body.firstName)}`);
      res.status(201).send({ firstName: req.body.firstName });
    })
    .catch(next);

module.exports.signIn = (req, res, next) =>
  credentialsHelper
    .signIn(req.body)
    .then(token => {
      res.status(200).send({ response: token });
    })
    .catch(next);

module.exports.index = (req, res, next) => {
  console.log('entra en el controller');
  return models.user
    .findAll()
    .then(users => {
      res.status(200).send({ response: users });
    })
    .catch(next);
};
