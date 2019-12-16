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
  const previousToken = await models.session.findOne({ where: { userId: user.id } });
  if (previousToken) {
    await previousToken.destroy();
  }

  const newSession = await models.session.create({ userId: user.id });
  const current = new Date();
  const expireTime = current.setSeconds(current.getSeconds() + 2);
  const tokenArray = { token: newSession.id, email: user.email, expireTime };
  return { token: jwt.encode(tokenArray, process.env.SECRET_KEY), expireTime };
};
