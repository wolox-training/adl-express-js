const models = require('../models/index');
const errors = require('../errors');
const generatePassword = require('../helpers/users/generatePassword');
const logger = require('../logger');
const constants = require('../../lib/constants');

module.exports.signUp = body =>
  models.user.findOne({ where: { email: body.email } }).then(user => {
    if (user) {
      return user.update({ type: constants.user_types.ADMIN });
    }
    return models.user
      .create({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        password: generatePassword.hashPassword(body.password),
        type: constants.user_types.ADMIN
      })
      .catch(error => {
        logger.error(`An error occurs in database: ${JSON.stringify(error)}`);
        throw errors.databaseError(`An error occurs in database: ${JSON.stringify(error)}`);
      });
  });
