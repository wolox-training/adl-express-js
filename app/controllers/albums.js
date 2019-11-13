const albumsService = require('../services/album');
const logger = require('../logger');

module.exports.albums = () => {
  albumsService
    .albums()
    .then(albumsList => logger.info(albumsList))
    .catch('Error while displaying albums');
};

module.exports.photos = () => {
  albumsService
    .photos()
    .then(photosList => logger.info(photosList))
    .catch('Error while displaying photos');
};
