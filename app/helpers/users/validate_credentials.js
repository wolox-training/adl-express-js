const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const models = require('../../models/index');
const errors = require('../../errors');

module.exports.signIn = body =>
  models.user
    .findOne({
      where: { email: body.email }
    })
    .then(user => {
      if (!user || !bcrypt.compareSync(body.password, user.password)) {
        throw errors.invalidCredentials('Invalid credentials, please try again');
      }

      return jwt.encode(user.email, process.env.SECRET_KEY);
    })
    .catch(error => errors.databaseError(error));