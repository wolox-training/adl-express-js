const albumsService = require('../services/album');
const errors = require('../errors');

module.exports.albums = () => {
  albumsService
    .albums()
    .then(albumsList => albumsList)
    .catch(() => {
      throw errors.externalApiError('Error in external API');
    });
};

module.exports.photos = albumId => {
  albumsService
    .photos(albumId)
    .then(photosList => photosList)
    .catch(() => {
      throw errors.externalApiError('Error in external API');
    });
};
