const albumsService = require('../services/album');

module.exports.albums = (_, res, next) => {
  albumsService
    .albums()
    .then(albumsList => albumsList)
    .catch(next);
};

module.exports.photos = (req, res, next) => {
  albumsService
    .photos(req.params.id)
    .then(photosList => photosList)
    .catch(next);
};

module.exports.buy = (req, res, next) => albumsService.buy(req.params.id);
