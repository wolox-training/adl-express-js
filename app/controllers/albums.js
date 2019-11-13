const albumsService = require('../services/album');

const albums = () => {
  albumsService
    .albums()
    .then(albumsr => albumsr)
    .catch();
};

const photos = () => {
  albumsService
    .photos()
    .then(photosr => console.log(photosr))
    .catch();
};

console.log(photos());
console.log(albums());
