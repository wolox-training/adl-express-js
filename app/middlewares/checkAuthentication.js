const jwt = require('jwt-simple');
const errors = require('../errors');
const models = require('../models/index');

const decode = token => {
  try {
    const result = jwt.decode(token, process.env.SECRET_KEY);
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
    decode(req.headers.token);
  } catch (e) {
    throw errors.invalidToken();
  }

  return next();
};

module.exports.validateAdmin = (req, res, next) =>
  decode(req.headers.token)
    .then(user => {
      if (user.type !== 'admin') {
        throw errors.invalidCredentials();
      }
      return next();
    })
    .catch(error => {
      next(error);
    });
