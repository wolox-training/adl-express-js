const models = require('../models/index');
const errors = require('../errors');
const signUpValidator = require('../interactors/sign_up_validator');
const generatePassword = require('../helpers/users/generate_password');

module.exports.signUp = body => {
  signUpValidator.validate(body);

  return models.user.findOne({ where: { email: body.email } }).then(user => {
    if (user) {
      throw errors.emailInUseError();
    } else {
      return generatePassword.hashPassword(body.password).then(hashedPassword =>
        models.user
          .create({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: hashedPassword
          })
          .catch(error => {
            throw errors.databaseError(`An error occurs in database: ${JSON.stringify(error)}`);
          })
      );
    }
  });
};
