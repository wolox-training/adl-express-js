const axios = require('axios');
const logger = require('../logger');
const errors = require('../errors');
const models = require('../models/index');

const apiUrl = 'https://jsonplaceholder.typicode.com';

exports.albums = () =>
  axios
    .get(`${apiUrl}/albums`)
    .then(response => {
      logger.info(`Received albums: ${JSON.stringify(response)}`);
      return response;
    })
    .catch(() => {
      throw errors.externalApiError('Error in external API');
    });

exports.photos = albumId =>
  axios
    .get(`${apiUrl}/albums/${albumId}/photos`)
    .then(response => {
      logger.info(`Received photos: ${JSON.stringify(response)}`);
      return response;
    })
    .catch(() => {
      throw errors.externalApiError('Error in external API');
    });

exports.buy = async (albumId, currentUser) => {
  try {
    const response = await axios.get(`${apiUrl}/albums/${albumId}`);
    let album = await models.album.findOne({ where: { title: response.data.title } });
    if (!album) {
      album = await models.album.create({
        title: response.data.title,
        userId: currentUser.dataValues.id
      });
    }
    const boughtAlbum = await models.userAlbums.findOne({
      where: { albumId: album.id, userId: currentUser.id }
    });

    if (boughtAlbum) {
      throw errors.albumPurchased();
    }

    await currentUser.addAlbums(album);

    return album;
  } catch (error) {
    logger.error(`An error occurs in database: ${JSON.stringify(error)}`);
    throw error;
  }
};

exports.listAlbums = async userId => {
  try {
    const userAlbums = await models.album.findAll({
      include: [
        {
          model: models.user,
          attributes: ['id'],
          through: { where: { id: userId } },
          as: 'users'
        }
      ]
    });

    return userAlbums;
  } catch (error) {
    throw errors.databaseError(error);
  }
};
