const models = require('../models/index');
const usersService = require('../services/users');

module.exports.sign_up = (req, res, next) => {
  usersService
    .sign_up(req.body)
    .then()
    .catch(next);
};

module.exports.sign_up = (req, res, next) => {};
