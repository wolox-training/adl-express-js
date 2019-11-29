const models = require('../models/index');
const errors = require('../errors');
const generatePassword = require('../helpers/users/generate_password');

const numberOfRecords = 10;

module.exports.signUp = body =>
  models.user.findOne({ where: { email: body.email } }).then(user => {
    if (user) {
      throw errors.emailInUseError();
    } else {
      return models.user
        .create({
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          password: generatePassword.hashPassword(body.password)
        })
        .catch(error => {
          throw errors.databaseError(`An error occurs in database: ${JSON.stringify(error)}`);
        });
    }
  });

module.exports.index = page =>
  models.user
    .findAndCountAll({ offset: numberOfRecords * page, limit: numberOfRecords })
    .catch(error => error);
