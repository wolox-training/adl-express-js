const models = require('../models/index');
const logger = require('../logger');
const errors = require('../errors');

const signUp = (body, next) => {
  models.users
    .findOne({ where: { email: body.email } })
    .then(user => {
      if (user) {
        throw errors.databaseError('Email in use');
      } else {
        console.log('holis');
      }
    })
    .catch(next);
};

/*
    .then(dataValues => {
      console.log('--------------------------------------------------------------');
      console.log(dataValues);
      if (!dataValues) {
        models.users.create({
          firstName: 'Roberto',
          lastName: 'Gonzalez',
          email: 'email@email.com',
          password: 'pass'
        });
      }
    });
    */
