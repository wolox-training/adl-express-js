const { factory } = require('factory-girl');
const faker = require('faker');
const models = require('../../app/models/index');

factory.define('album', models.album, {
  title: faker.name.jobTitle
});
