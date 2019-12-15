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

      return models.session.findOne({ where: { user_id: user.id } }).then(previousSession => {
        if (previousSession) {
          return previousSession.destroy();
        }

        return models.session.create({ user_id: user.id }).then(session => {
          const current = new Date();
          const expireTime = current.setSeconds(current.getSeconds() + 2);
          const tokenArray = { sessionId: session.id, email: user.email, expireTime };

          return jwt.encode(tokenArray, process.env.SECRET_KEY);
        });
      });
    });
