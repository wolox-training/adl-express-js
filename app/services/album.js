const axios = require('axios');

exports.albums = () =>
  axios.get('https://jsonplaceholder.typicode.com/albums').then(response => {
    console.log(response);
  });
