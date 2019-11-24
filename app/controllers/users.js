const logger = require('../logger');
const usersService = require('../services/users');

module.exports.signUp = (req, res, next) => {
  usersService
    .signUp(req.body)
    .then(() => {
      logger.info(`Created user: ${JSON.stringify(req.body.firstName)}`);
      res.status(201).send(req.body.firstName);
    })
    .catch(next);
};
