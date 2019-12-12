const models = require('../models/index');
const logger = require('../logger');

module.exports.invalidateAll = async currentUser => {
  try {
    const currentSession = await models.session.findOne({ where: { userId: currentUser.id } });
    return await currentSession.destroy();
  } catch (error) {
    logger.error(`An error occurs: ${JSON.stringify(error)}`);
    throw error;
  }
};
