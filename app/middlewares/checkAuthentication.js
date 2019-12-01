const jwt = require('jwt-simple');
const errors = require('../errors');
const models = require('../models/index');

const decode = token => {
  const result = jwt.decode(token, process.env.SECRET_KEY);
  return models.user
    .findOne({
      where: { email: result }
    })
    .then(email => {
      if (!email) {
        throw errors.invalidCredentials();
      }
    });
};

module.exports.validate = (req, res, next) => {
  try {
    decode(req.headers.token);
  } catch (e) {
    throw errors.invalidCredentials();
  }

  return next();
};
