const axios = require('axios');
const logger = require('../logger');
const errors = require('../errors');

exports.albums = () =>
  axios
    .get('https://jsonplaceholder.typicode.com/albums')
    .then(response => {
      logger.info(`Received albums: ${JSON.stringify(response)}`);
      return response;
    })
    .catch(() => {
      throw errors.external_api_error('Error in external API');
    });
