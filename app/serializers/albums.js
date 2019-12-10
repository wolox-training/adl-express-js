const albums = albumsArray => ({
  albums: albumsArray.map(album => ({
    id: album.id,
    title: album.title
  }))
});

module.exports = {
  albums
};
