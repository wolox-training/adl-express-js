const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const models = require('../models/index');
const errors = require('../errors');
const config = require('../../config');

const { tokenExpiration } = config.common.api;

module.exports.signIn = async body => {
  const user = await models.user
    .findOne({
      where: { email: body.email }
    })
    .catch(() => {
      throw errors.databaseError('Could not find an user');
    });

  if (!user || !bcrypt.compareSync(body.password, user.password)) {
    throw errors.invalidCredentials('Invalid credentials, please try again');
  }

  const previousToken = await models.session.findOne({ where: { userId: user.id } }).catch(() => {
    throw errors.databaseError('Could not find a session for this user');
  });

  if (previousToken) {
    await previousToken.destroy().catch(() => {
      throw errors.databaseError('Could not destroy session successfully');
    });
  }

  const newSession = await models.session.create({ userId: user.id }).catch(() => {
    throw errors.databaseError('Could not create a new session successfully');
  });
  const current = new Date();
  const expireTime = current.setSeconds(current.getSeconds() + parseInt(tokenExpiration));
  const tokenArray = { token: newSession.id, email: user.email, expireTime };
  try {
    return { token: jwt.encode(tokenArray, process.env.SECRET_KEY), expireTime };
  } catch (error) {
    throw errors.invalidCredentials('Could not return token succesfully');
  }
};
