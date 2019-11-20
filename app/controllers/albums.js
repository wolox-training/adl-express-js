const albumsService = require('../services/album');

module.exports.albums = (_, res, next) => {
  albumsService
    .albums()
    .then(albumsList => albumsList)
    .catch(next);
};

module.exports.photos = (req, res, next) => {
  albumsService
    .photos(req.params.albumId)
    .then(photosList => photosList)
    .catch(next);
};
