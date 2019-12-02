const supertest = require('supertest');
const jwt = require('jwt-simple');
const { factory } = require('factory-girl');
const faker = require('faker');
const bcrypt = require('bcrypt');
const models = require('../../app/models/index');
const app = require('../../app');

const request = supertest(app);
const userAttributes = {
  firstName: 'Omar',
  lastName: 'Rodriguez',
  email: 'omar.rodriguez@wolox.com',
  password: 'password1923'
};

const signUpUser = () => request.post('/users').send(userAttributes);
const createAndSignInUser = () => {
  userAttributes.password = 'password1923';
  return signUpUser().then(() =>
    request
      .post('/users/sessions')
      .send({ email: 'omar.rodriguez@wolox.com', password: 'password1923' })
      .then(response => response.body.response)
  );
};

factory.define('user', models.user, {
  firstName: faker.name.firstName,
  lastName: faker.name.lastName,
  email: faker.internet.email,
  password: bcrypt.hashSync('password1923', 10)
});

describe('usersController.signUp', () => {
  it('Creates a user', () =>
    request
      .post('/users')
      .send(userAttributes)
      .then(response => {
        expect(response.body.firstName).toBe('Omar');
      })
      .then(() =>
        models.user
          .findOne({
            where: {
              firstName: 'Omar',
              lastName: 'Rodriguez',
              email: 'omar.rodriguez@wolox.com'
            }
          })
          .then(user => {
            expect(user.email).toBe('omar.rodriguez@wolox.com');
          })
      ));

  it('Try to create a existing user and fails', () =>
    request
      .post('/users')
      .send(userAttributes)
      .then(() =>
        request
          .post('/users')
          .send(userAttributes)
          .then(response => expect(response.body.internal_code).toBe('email_already_in_use'))
      ));

  it('Try to create a user with invalid email and fails', () => {
    userAttributes.email = 'omar.rodriguez@wolox.ed';

    return request
      .post('/users')
      .send(userAttributes)
      .then(response => {
        expect(response.body.internal_code).toBe('invalid_email');
      });
  });

  it('Try to create a user with invalid password and fails', () => {
    userAttributes.email = 'omar.rodriguez@wolox.com';
    userAttributes.password = 'ab123';

    return request
      .post('/users')
      .send(userAttributes)
      .then(response => {
        expect(response.body.internal_code).toBe('invalid_password');
      });
  });
});

describe('usersController.screateUserignIn', () => {
  beforeEach(() => {
    userAttributes.email = 'omar.rodriguez@wolox.com';
    userAttributes.password = 'password1923';
    return signUpUser();
  });

  it('Log in with previously created user', () =>
    request
      .post('/users/sessions')
      .send({ email: 'omar.rodriguez@wolox.com', password: 'password1923' })
      .then(response => {
        expect(jwt.decode(response.body.response, process.env.SECRET_KEY)).toBe('omar.rodriguez@wolox.com');
      }));

  it('Tries to log in with correct email but invalid password and fails ', () =>
    request
      .post('/users/sessions')
      .send({ email: 'omar.rodriguez@wolox.com', password: 'invalidPassword18' })
      .then(response => {
        expect(response.body.message).toBe('Invalid credentials, please try again');
      }));

  it('Tries to log in with invalid email and validator fails ', () =>
    request
      .post('/users/sessions')
      .send({ email: 'omar.rodriguez@wolox.ed', password: 'password1923' })
      .then(response => {
        expect(response.body.internal_code).toBe('invalid_email');
      }));
});

describe('usersController.users', () => {
  it('List users', () =>
    factory.createMany('user', 5).then(() =>
      createAndSignInUser().then(token =>
        request
          .get('/users?page=0')
          .set('token', token)
          .send({})
          .then(response => {
            expect(response.body.response.count).toBe(6);
          })
      )
    ));

  it('Try to list user without correct token', () =>
    createAndSignInUser().then(() =>
      request
        .get('/users?page=0')
        .set('token', '43ldlds.3023032.adlfkasls')
        .send({})
        .then(response => {
          expect(response.body.internal_code).toBe('invalid_token');
        })
    ));
});
