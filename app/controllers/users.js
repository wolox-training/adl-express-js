const logger = require('../logger');
const usersService = require('../services/users');
const credentialsHelper = require('../helpers/users/validate_credentials');

module.exports.signUp = (req, res, next) =>
  usersService
    .signUp(req.body)
    .then(() => {
      logger.info(`Created user: ${JSON.stringify(req.body.firstName)}`);
      res.status(201).send({ firstName: req.body.firstName });
    })
    .catch(next);

module.exports.signIn = (req, _, next) => {
  credentialsHelper
    .signIn(req.body)
    .then(user => {
      console.log(user);
    })
    .catch(next);
};
