const models = require('../models/index');
const logger = require('../logger');

module.exports.invalidate = async currentUser => {
  try {
    const currentSession = await models.session.findOne({ where: { userId: currentUser.id } });
    // debugger;
    return await currentSession.destroy();
    // const currentSession2 = await models.session.findOne({ where: { userId: currentUser.id } });
    // debugger;
  } catch (error) {
    logger.error(`An error occurs: ${JSON.stringify(error)}`);
    throw error;
  }
};
