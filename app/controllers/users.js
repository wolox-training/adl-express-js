const logger = require('../logger');
const usersService = require('../services/users');
// const signUpValidator = require('../middlewares/sign_up_validator');

module.exports.signUp = (req, res, next) =>
  usersService
    .signUp(req.body)
    .then(() => {
      logger.info(`Created user: ${JSON.stringify(req.body.firstName)}`);
      res.status(201).send({ firstName: req.body.firstName });
    })
    .catch(next);
