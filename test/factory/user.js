const { factory } = require('factory-girl');
const User = require('../../app/models/user');

factory.define('user', User, {
  firstName: Math.random()
    .toString(36)
    .substring(2, 15),
  lastName: Math.random()
    .toString(36)
    .substring(2, 15),
  email: `${Math.random()
    .toString(36)
    .substring(2, 15)}@wolox.com`,
  password: 'passwordRandom132'
});
