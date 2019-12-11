const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const models = require('../models/index');
const errors = require('../errors');

module.exports.signIn = async body => {
  const user = await models.user.findOne({
    where: { email: body.email }
  });
  if (!user || !bcrypt.compareSync(body.password, user.password)) {
    throw errors.invalidCredentials('Invalid credentials, please try again');
  }
  const previousToken = await models.token.findOne({ where: { userId: user.id } });
  if (previousToken) {
    await previousToken.destroy();
  }

  const newToken = await models.token.create({ userId: user.id });
  const tokenArray = { token: newToken.id, email: user.email };
  return jwt.encode(tokenArray, process.env.SECRET_KEY);
};
