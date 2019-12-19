const jwt = require('jwt-simple');
const moment = require('moment');
const errors = require('../errors');
const models = require('../models/index');
const constants = require('../../lib/constants');
const config = require('../../config');
const logger = require('../logger');

const SECRET_KEY = config.common.api.secretKey;

const decode = token => {
  try {
    const result = jwt.decode(token, SECRET_KEY);
    return models.user
      .findOne({
        where: { email: result.email }
      })
      .then(user => {
        if (!user) {
          throw errors.invalidToken();
        }

        return models.session.findOne({ where: { userId: user.id } }).then(session => {
          if (
            !session ||
            session.id !== result.session_id ||
            result.expireTime < moment().format('MMMM Do YYYY, h:mm:ss a')
          ) {
            throw errors.invalidToken();
          }
          return user;
        });
      })
      .catch(() => {
        throw errors.invalidToken();
      });
  } catch (error) {
    logger.error(`An error occurs with your authentication: ${JSON.stringify(error)}`);
    throw errors.invalidToken();
  }
};

module.exports.validate = async (req, res, next) => {
  try {
    const user = await decode(req.headers.token);
    req.currentUser = user;
    return next();
  } catch (error) {
    logger.error(`An error occurs: ${JSON.stringify(error)}`);
    return next(error);
  }
};

module.exports.validateAdmin = (req, res, next) =>
  decode(req.headers.token)
    .then(user => {
      if (user.type !== constants.user_types.ADMIN) {
        throw errors.invalidCredentials();
      }
      return next();
    })
    .catch(error => {
      next(error);
    });
