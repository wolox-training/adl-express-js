const models = require('../models/index');
// const logger = require('../logger');
const errors = require('../errors');
const signUpValidator = require('../interactors/sign_up_validator');

module.exports.signUp = body =>
  models.user
    .findOne({ where: { email: body.email } })
    .then(user => {
      if (user) {
        throw errors.databaseError('Email in use');
      } else {
        signUpValidator.validate(body);
        models.users
          .create({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: body.password
          })
          .catch(error => error);
      }
    })
    .catch(error => {
      throw error;
    });

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
