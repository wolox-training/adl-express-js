const supertest = require('supertest');
const jwt = require('jwt-simple');
const { factory } = require('factory-girl');
const models = require('../../app/models/index');
const app = require('../../app');

const request = supertest(app);
const userAttributes = {
  firstName: 'Omar',
  lastName: 'Rodriguez',
  email: 'omar.rodriguez@wolox.co',
  password: 'password1923'
};

const User = models.user;

factory.define('user', User, {
  firstName: Math.random()
    .toString(36)
    .substring(2, 15),
  lastName: Math.random()
    .toString(36)
    .substring(2, 15),
  email: 'alejandro.gonzalez@wolox.co',
  password: 'passwordRandom132'
});

const createAndSignInUser = () => {
  userAttributes.password = 'password1923';
  return request
    .post('/users')
    .send(userAttributes)
    .then(() =>
      request
        .post('/users/sessions')
        .send({ email: 'omar.rodriguez@wolox.co', password: 'password1923' })
        .then(response => response.body.response)
    );
};

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

describe('usersController.signIn', () => {
  it('Log in with previously created user', () => {
    userAttributes.password = 'password1923';
    return request
      .post('/users')
      .send(userAttributes)
      .then(() =>
        request
          .post('/users/sessions')
          .send({ email: 'omar.rodriguez@wolox.com', password: 'password1923' })
          .then(response => {
            expect(jwt.decode(response.body.response, process.env.SECRET_KEY)).toBe(
              'omar.rodriguez@wolox.com'
            );
          })
      );
  });

  it('Tries to log in with correct email but invalid password and fails ', () => {
    userAttributes.password = 'password1923';
    return request
      .post('/users')
      .send(userAttributes)
      .then(() =>
        request
          .post('/users/sessions')
          .send({ email: 'omar.rodriguez@wolox.com', password: 'invalidPassword18' })
          .then(response => {
            expect(response.body.message).toBe('Invalid credentials, please try again');
          })
      );
  });

  it('Tries to log in with invalid email and validator fails ', () => {
    userAttributes.password = 'password1923';
    return request
      .post('/users')
      .send(userAttributes)
      .then(() =>
        request
          .post('/users/sessions')
          .send({ email: 'omar.rodriguez@wolox.ed', password: 'password1923' })
          .then(response => {
            expect(response.body.internal_code).toBe('invalid_email');
          })
      );
  });
});

describe('usersController.users', () => {
  it.only('List users', () =>
    createAndSignInUser().then(token =>
      request
        .get('/users')
        .set('token', token)
        .send({ page: 0 })
        .then(response => {
          expect(response.body).toBe('ok');
        })
    ));
});
