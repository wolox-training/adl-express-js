// const models = require('../models/index');
const usersService = require('../services/users');

module.exports.signUp = (req, res, next) => {
  usersService
    .signUp(req.body)
    .then(
      console.log('------------------------------------------')
      // res.send('todo bien')
    )
    .catch(next);
};
