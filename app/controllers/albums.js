const albumsService = require('../services/album');

module.exports.albums = (_, res, next) => {
  albumsService
    .albums()
    .then(albumsList => albumsList)
    .catch(error => next(error));
};

module.exports.photos = (albumId, _, res, next) => {
  albumsService
    .photos(albumId)
    .then(photosList => photosList)
    .catch(error => next(error));
};
