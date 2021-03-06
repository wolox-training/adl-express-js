const errors = require('../errors');

const PASSWORD_MIN_LENGTH = 8;

const validateEmail = email => {
  const re = /@wolox\.(com|com\.cl|co|com\.mx|com\.ar)$/;
  return re.test(email);
};

const validatePassword = password => {
  const letter = /[a-zA-Z]/;
  const number = /[0-9]/;
  return number.test(password) && letter.test(password) && password.length > PASSWORD_MIN_LENGTH;
};

module.exports.validate = (req, _, next) => {
  if (!validateEmail(req.body.email)) {
    throw errors.emailError();
  }

  if (!validatePassword(req.body.password)) {
    throw errors.passwordError();
  }

  return next();
};
