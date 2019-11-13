const albumsService = require('../services/album');

const albums = () => {
  albumsService
    .albums()
    .then(albums => albums)
    .catch();
};

const photos = () => {
  albumsService
    .photos()
    .then(photos => console.log(photos))
    .catch();
};

console.log(photos());
console.log(albums());
