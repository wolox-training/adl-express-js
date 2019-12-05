const supertest = require('supertest');
const bcrypt = require('bcrypt');
const { factory } = require('factory-girl');
const app = require('../../app');
const { factoryAllModels } = require('../factory/factory_by_models');
const models = require('../../app/models/index');

factoryAllModels();

const request = supertest(app);

const createUser = (firstName, email, password) =>
  factory.create('user', { firstName, email, password: bcrypt.hashSync(password, 10), type: 'user' });

const createAdminUser = (firstName, email, password) =>
  factory.create('user', { firstName, email, password: bcrypt.hashSync(password, 10), type: 'admin' });

describe('adminsController.signUp', () => {
  it('creates one admin and one common user and updates common user to admin', () =>
    createAdminUser('Omar', 'omar.rodriguez.admin@wolox.com', 'password1923').then(() =>
      createUser('Carlos', 'carlos.quiroga@wolox.com', 'password1923').then(() =>
        request
          .post('/users/sessions')
          .send({ email: 'omar.rodriguez.admin@wolox.com', password: 'password1923' })
          .then(signInResponse =>
            request
              .post('/admin/users')
              .set('token', signInResponse.body.response)
              .send({
                firstName: 'Carlos',
                email: 'carlos.quiroga@wolox.com',
                password: 'password1923'
              })
              .then(() =>
                models.user.findOne({ where: { email: 'carlos.quiroga@wolox.com' } }).then(user => {
                  expect(user.type).toBe('admin');
                })
              )
          )
      )
    ));

  it('creates an admin user', () =>
    createUser('Omar', 'omar.rodriguez.admin@wolox.com', 'password1923').then(() =>
      createUser('Carlos', 'carlos.quiroga@wolox.com', 'password1923').then(() =>
        request
          .post('/users/sessions')
          .send({ email: 'omar.rodriguez.admin@wolox.com', password: 'password1923' })
          .then(signInResponse =>
            request
              .post('/admin/users')
              .set('token', signInResponse.body.response)
              .send({
                firstName: 'Carlos',
                lastName: 'Quiroga',
                email: 'carlos.quiroga@wolox.com',
                password: 'password1923'
              })
              .then(response => {
                expect(response.body.internal_code).toBe('invalid_credentials');
              })
          )
      )
    ));

  it('tries to update user without admin role and fails', () =>
    createUser('Omar', 'omar.rodriguez.admin@wolox.com', 'password1923').then(() =>
      createUser('Carlos', 'carlos.quiroga@wolox.com', 'password1923').then(() =>
        request
          .post('/users/sessions')
          .send({ email: 'omar.rodriguez.admin@wolox.com', password: 'password1923' })
          .then(signInResponse =>
            request
              .post('/admin/users')
              .set('token', signInResponse.body.response)
              .send({
                firstName: 'Carlos',
                email: 'carlos.quiroga@wolox.com',
                password: 'password1923'
              })
              .then(response => {
                expect(response.body.internal_code).toBe('invalid_credentials');
              })
          )
      )
    ));
});
