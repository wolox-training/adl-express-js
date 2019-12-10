const constants = require('../../lib/constants');
const errors = require('../errors');

const isOwner = (currentUserId, user) => parseInt(currentUserId) === user.id;

const isAdmin = user => user.type === constants.user_types.ADMIN;

module.exports.ownerAdmin = async (req, _, next) => {
  const user = await req.currentUser;
  try {
    if ((isAdmin(user) || isOwner(req.params.userId, user)) === false) {
      throw errors.invalidCredentials();
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
