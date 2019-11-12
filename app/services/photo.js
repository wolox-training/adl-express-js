const axios = require('axios');
const logger = require('../logger');
const errors = require('../errors');

exports.photos = () =>
  axios
    .get('https://jsonplaceholder.typicode.com/photos')
    .then(response => {
      logger.info(`Received photos: ${JSON.stringify(response)}`);
      return response;
    })
    .catch(() => {
      throw errors.external_api_error('Error in external API');
    });
