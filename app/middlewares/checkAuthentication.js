const jwt = require('jwt-simple');
const errors = require('../errors');
const models = require('../models/index');
const constants = require('../../lib/constants');
const config = require('../../config');

const SECRET_KEY = config.common.api.secretKey;

const decode = token => {
  try {
    const result = jwt.decode(token, SECRET_KEY);
    return models.user
      .findOne({
        where: { email: result }
      })
      .then(user => {
        if (!user) {
          throw errors.invalidToken();
        }
        return user;
      });
  } catch (e) {
    throw errors.invalidToken();
  }
};

module.exports.validate = (req, res, next) => {
  try {
    const user = decode(req.headers.token);
    req.currentUser = user;
  } catch (e) {
    throw errors.invalidToken();
  }

  return next();
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
