const supertest = require('supertest');
const models = require('../../app/models/index');
const app = require('../../app');

const request = supertest(app);

describe('usersController.signUp', () => {
  it('Creates a user', () => {
    const userAttributes = {
      firstName: 'Omar',
      lastName: 'Rodriguez',
      email: 'omar.rodriguez@wolox.com',
      password: 'password1923'
    };

    return request
      .post('/users')
      .send(userAttributes)
      .then(response => {
        expect(response.text).toBe('Created user: Omar');
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
      );
  });
});
