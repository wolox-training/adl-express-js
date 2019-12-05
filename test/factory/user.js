const { factory } = require('factory-girl');
const faker = require('faker');
const bcrypt = require('bcrypt');
const models = require('../../app/models/index');

factory.define('user', models.user, {
  firstName: faker.name.firstName,
  lastName: faker.name.lastName,
  email: faker.internet.email,
  password: bcrypt.hashSync('password1923', 10)
});
