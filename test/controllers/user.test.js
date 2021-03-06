const supertest = require('supertest');
const jwt = require('jwt-simple');
const sleep = require('util').promisify(setTimeout);
const { factory } = require('factory-girl');
const bcrypt = require('bcrypt');
const axios = require('axios');
const models = require('../../app/models/index');
const app = require('../../app');
const { factoryAllModels } = require('../factory/factory_by_models');
const config = require('../../config');
const constants = require('../../lib/constants');

const SECRET_KEY = config.common.api.secretKey;

jest.mock('axios');

factoryAllModels();

const request = supertest(app);
const userAttributes = (firstName, lastName, email, password) => ({
  first_name: firstName,
  last_name: lastName,
  email,
  password
});

const createUser = (first_name, last_name, email, password) =>
  factory.create('user', userAttributes(first_name, last_name, email, bcrypt.hashSync(password, 10)));

const createAndSignInUser = () =>
  createUser('Omar', 'Rodriguez', 'omar.rodriguez@wolox.com', 'password1923').then(() =>
    request
      .post('/users/sessions')
      .send({ email: 'omar.rodriguez@wolox.com', password: 'password1923' })
      .then(response => response.body.response)
  );

describe('usersController.signUp', () => {
  it('Creates a user', () =>
    request
      .post('/users')
      .send(userAttributes('Omar', 'Rodriguez', 'omar.rodriguez@wolox.com', 'password1923'))
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
    createUser('Omar', 'Rodriguez', 'omar.rodriguez@wolox.com', 'password1923').then(() =>
      request
        .post('/users')
        .send(userAttributes('Omar', 'Rodriguez', 'omar.rodriguez@wolox.com', 'password1923'))
        .then(response => expect(response.body.internal_code).toBe('email_already_in_use'))
    ));

  it('Try to create a user with invalid email and fails', () =>
    request
      .post('/users')
      .send(userAttributes('Omar', 'Rodriguez', 'omar.rodriguez@wolox.ed', 'password1923'))
      .then(response => {
        expect(response.body.internal_code).toBe('invalid_email');
      }));

  it('Try to create a user with invalid password and fails', () =>
    request
      .post('/users')
      .send(userAttributes('Omar', 'Rodriguez', 'omar.rodriguez@wolox.com', 'ab123'))
      .then(response => {
        expect(response.body.internal_code).toBe('invalid_password');
      }));
});

describe('usersController.createUserSignIn', () => {
  beforeEach(() => createUser('Omar', 'Rodriguez', 'omar.rodriguez@wolox.com', 'password1923'));

  it('Log in with previously created user', () =>
    request
      .post('/users/sessions')
      .send({ email: 'omar.rodriguez@wolox.com', password: 'password1923' })
      .then(response => {
        expect(jwt.decode(response.body.response.token, SECRET_KEY).email).toBe('omar.rodriguez@wolox.com');
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
      createAndSignInUser().then(signInResponse =>
        request
          .get('/users?page=0')
          .set('token', signInResponse.token)
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

describe('usersController.buyAlbum', () => {
  const data = {
    data: {
      userId: 1,
      id: 4,
      title: 'non esse culpa molestiae omnis sed optio'
    }
  };
  beforeEach(() => axios.get.mockImplementation(() => Promise.resolve(data)));

  it('Buys one album', async () => {
    const signInResponse = await createAndSignInUser();
    const { token } = signInResponse;
    const response = await request.post('/albums/4').set('token', token);
    const ua = await models.userAlbums.findOne({ where: { albumId: response.body.album.id } });

    expect(ua.dataValues.albumId).toBe(response.body.album.id);
  });

  it('Tries to buy the same album and fails', async () => {
    const signInResponse = await createAndSignInUser();
    const { token } = signInResponse;
    await request.post('/albums/4').set('token', token);
    const response = await request.post('/albums/4').set('token', token);

    expect(response.body.internal_code).toBe('album_already_purchased');
  });

  it('Tries to buy an album without login and fails', async () => {
    const response = await request.post('/albums/4').set('token', 'no-valid-token');

    expect(response.body.internal_code).toBe('invalid_token');
  });
});

describe('usersController.listAlbums', () => {
  it('Returns its all albums', async () => {
    const albums = await factory.createMany('album', 3);
    const signInResponse = await createAndSignInUser();
    const { token } = signInResponse;
    const currentUser = await models.user.findOne({
      where: { email: jwt.decode(token, SECRET_KEY).email }
    });
    await currentUser.addAlbums(albums);
    const response = await request.get(`/users/${currentUser.id}/albums`).set('token', token);

    expect(response.body.userAlbums.albums.length).toBe(3);
  });

  it('Tries to get albums of another user and fails', async () => {
    const albums = await factory.createMany('album', 3);
    const signInResponse = await createAndSignInUser();
    const { token } = signInResponse;
    const owner = await createUser('Dante', 'Farias', 'dante.farias@wolox.com', 'password1923');
    await owner.addAlbums(albums);
    const response = await request.get(`/users/${owner.id}/albums`).set('token', token);
    expect(response.body.internal_code).toBe('invalid_credentials');
  });

  it('Tries to get albums of another user being admin and success', async () => {
    const albums = await factory.createMany('album', 3);
    const signInResponse = await createAndSignInUser();
    const { token } = signInResponse;
    const owner = await createUser('Dante', 'Farias', 'dante.farias@wolox.com', 'password1923');
    await owner.addAlbums(albums);
    const currentUser = await models.user.findOne({
      where: { email: jwt.decode(token, SECRET_KEY).email }
    });
    await currentUser.update({ type: constants.user_types.ADMIN });
    const response = await request.get(`/users/${owner.id}/albums`).set('token', token);

    expect(response.body.userAlbums.albums.length).toBe(3);
  });

  it('Tries to get albums with a expired token and fails', async () => {
    const albums = await factory.createMany('album', 3);
    const signInResponse = await createAndSignInUser();
    const { token } = signInResponse;
    const owner = await createUser('Dante', 'Farias', 'dante.farias@wolox.com', 'password1923');
    await owner.addAlbums(albums);
    const currentUser = await models.user.findOne({
      where: { email: jwt.decode(token, SECRET_KEY).email }
    });
    await currentUser.update({ type: constants.user_types.ADMIN });
    await sleep(4000);
    const response = await request.get(`/users/${owner.id}/albums`).set('token', token);

    expect(response.body.internal_code).toBe('invalid_token');
  });
});

describe('usersController.invalidate', () => {
  it("Invalidates all user's sessions and fails when tries to get some protected resource", async () => {
    const signInResponse = await createAndSignInUser();
    const { token } = signInResponse;
    const currentUser = await models.user.findOne({
      where: { email: jwt.decode(token, SECRET_KEY).email }
    });
    await request.post('/users/sessions/invalidate').set('token', token);
    const response = await request.get(`/users/${currentUser.id}/albums`).set('token', token);

    expect(response.body.internal_code).toBe('invalid_token');
  });
});
