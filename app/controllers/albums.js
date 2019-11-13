const albumsService = require('../services/album');

module.exports.albums = () => {
  albumsService
    .albums()
    .then(albumsList => albumsList)
    .catch('Error while displaying albums');
};

module.exports.photos = () => {
  albumsService
    .photos()
    .then(photosList => photosList)
    .catch('Error while displaying photos');
};
