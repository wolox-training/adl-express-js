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

/* exports.buy = albumId =>
  axios
    .get(`${apiUrl}/albums/${albumId}`)
    .then(response => {
      logger.info(`Album bought: ${JSON.stringify(response.data)}`);
      return response;
    })
    .catch(() => {
      throw errors.externalApiError('Error in external API');
    });
    */

exports.buy = async albumId => {
  const response = await axios.get(`${apiUrl}/albums/${albumId}/photos`);
  console.log(response);
  return response;
};
