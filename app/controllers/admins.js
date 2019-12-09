const logger = require('../logger');
const adminsService = require('../services/admins');

module.exports.signUp = (req, res, next) => {
  adminsService
    .signUp(req.body)
    .then(() => {
      logger.info(`Created admin user: ${JSON.stringify(req.body.first_name)}`);
      res.status(201).send({ adminName: req.body.first_name });
    })
    .catch(error => {
      logger.error(`An error occurs: ${JSON.stringify(error)}`);
      return next;
    });
};
