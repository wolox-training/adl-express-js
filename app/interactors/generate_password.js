const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports.hashPassword = plainPassword =>
  bcrypt
    .hash(plainPassword, saltRounds)
    .then(hash => {
      console.log(hash);
      return hash;
    })
    .catch(error => error);
