const jwt = require('jwt-simple');
const errors = require('../errors');
const models = require('../models/index');
const constants = require('../../lib/constants');
const config = require('../../config');
const logger = require('../logger');

const SECRET_KEY = config.common.api.secretKey;

const decodeToken = async token => {
  try {
    const result = await jwt.decode(token, SECRET_KEY);
    return result;
  } catch (error) {
    throw errors.invalidToken();
  }
};

const validateAuthentication = async decodeResult => {
  const user = await models.user.findOne({ where: { email: decodeResult.email } }).catch(() => {
    throw errors.databaseError();
  });
  if (!user) {
    throw errors.invalidToken();
  }
  const session = await models.session.findOne({ where: { userId: user.id } }).catch(() => {
    throw errors.databaseError();
  });
  if (!session || session.id !== decodeResult.token) {
    throw errors.invalidToken();
  }
  return user;
};

module.exports.validate = async (req, res, next) => {
  try {
    const decodeResult = await decodeToken(req.headers.token);
    const user = await validateAuthentication(decodeResult);
    req.currentUser = user;
    return next();
  } catch (error) {
    logger.error(`An error occurs: ${JSON.stringify(error)}`);
    return next(error);
  }
};

module.exports.validateAdmin = async (req, res, next) => {
  try {
    const decodeResult = await decodeToken(req.headers.token);
    const user = await validateAuthentication(decodeResult);
    if (user.type !== constants.user_types.ADMIN) {
      throw errors.invalidCredentials();
    }
    req.currentUser = user;
    return next();
  } catch (error) {
    logger.error(`An error occurs: ${JSON.stringify(error)}`);
    return next(error);
  }
};
