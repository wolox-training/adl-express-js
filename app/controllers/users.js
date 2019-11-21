// const models = require('../models/index');
const usersService = require('../services/users');

module.exports.signUp = (req, res, next) => {
  usersService
    .signUp(req.body)
    .then(() => res.send(req.body.firstName))
    .catch(next);
};
