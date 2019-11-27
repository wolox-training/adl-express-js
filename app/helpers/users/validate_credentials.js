const bcrypt = require('bcrypt');
const models = require('../../models/index');
const errors = require('../../errors');

module.exports.signIn = body =>
  models.user
    .findOne({
      where: { email: body.email }
    })
    .then(user => {
      if (!user || !bcrypt.compareSync(body.password, user.password)) {
        throw errors.invalidCredentials;
      }

      return true;
    });
