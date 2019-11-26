const logger = require('../logger');
const usersService = require('../services/users');
const signUpValidator = require('../interactors/sign_up_validator');

module.exports.signUp = (req, res, next) => {
  try {
    signUpValidator.validate(req.body);
  } catch (error) {
    next(error);
  }

  usersService
    .signUp(req.body)
    .then(() => {
      logger.info(`Created user: ${JSON.stringify(req.body.firstName)}`);
      res.status(201).send(req.body.firstName);
    })
    .catch(next);
};
