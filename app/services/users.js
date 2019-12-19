const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const models = require('../models/index');
const errors = require('../errors');
const config = require('../../config');
const generatePassword = require('../helpers/users/generatePassword');
const logger = require('../logger');

const { numberOfRecords } = config.common.api;

module.exports.signUp = body =>
  models.user.findOne({ where: { email: body.email } }).then(user => {
    if (user) {
      throw errors.emailInUseError();
    } else {
      return models.user
        .create({
          firstName: body.first_name,
          lastName: body.last_name,
          email: body.email,
          password: generatePassword.hashPassword(body.password)
        })
        .catch(error => {
          throw errors.databaseError(`An error occurs in database: ${JSON.stringify(error)}`);
        });
    }
  });

module.exports.index = page =>
  models.user.findAndCountAll({ offset: numberOfRecords * page, limit: numberOfRecords }).catch(error => {
    logger.error(error);
    throw error;
  });

module.exports.signIn = body =>
  models.user
    .findOne({
      where: { email: body.email }
    })
    .then(user => {
      if (!user || !bcrypt.compareSync(body.password, user.password)) {
        throw errors.invalidCredentials('Invalid credentials, please try again');
      }

      return models.session.findOne({ where: { userId: user.id } }).then(previousSession => {
        if (previousSession) {
          return previousSession.destroy().catch(() => {
            throw errors.databaseError('Could not destroy previous session');
          });
        }

        return models.session.create({ userId: user.id }).then(session => {
          const tokenArray = { sessionId: session.id, email: user.email };
          return jwt.encode(tokenArray, process.env.SECRET_KEY).catch(() => {
            throw errors.invalidToken('Could not return token successfully');
          });
        });
      });
    });
