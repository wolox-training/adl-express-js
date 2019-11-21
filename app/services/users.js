const models = require('../models/index');
const logger = require('../logger');
const errors = require('../errors');
const signUpValidator = require('../interactors/sign_up_validator');
const generatePassword = require('../interactors/generate_password');

module.exports.signUp = body =>
  models.user.findOne({ where: { email: body.email } }).then(user => {
    if (user) {
      throw errors.emailInUseError();
    } else {
      signUpValidator.validate(body);
      return generatePassword.hashPassword(body.password).then(hashedPassword =>
        models.user
          .create({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: hashedPassword
          })
          .catch(error => {
            logger.error(`An error occurs in database: ${JSON.stringify(error)}`);
            throw errors.databaseError(`An error occurs in database: ${JSON.stringify(error)}`);
          })
      );
    }
  });
