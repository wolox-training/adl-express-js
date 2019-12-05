const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports.hashPassword = plainPassword => bcrypt.hashSync(plainPassword, saltRounds);
