const jwt = require('jwt-simple');
const errors = require('../errors');
const models = require('../models/index');

module.exports.validate = (req, res, next) => {
  try {
    const result = jwt.decode(req.headers.token, process.env.SECRET_KEY);
    return models.user
      .findOne({
        where: { email: result }
      })
      .then(email => {
        if (!email) {
          throw errors.invalidCredentials();
        }

        return next();
      });
  } catch (error) {
    res.status(401).send({ message: error.message });
  }

  return next();
};
