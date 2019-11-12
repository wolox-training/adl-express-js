const axios = require('axios');
const logger = require('../logger');
const errors = require('../errors');

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

exports.photos = () =>
  axios
    .get(`${apiUrl}/photos`)
    .then(response => {
      logger.info(`Received photos: ${JSON.stringify(response)}`);
      return response;
    })
    .catch(() => {
      throw errors.externalApiError('Error in external API');
    });
