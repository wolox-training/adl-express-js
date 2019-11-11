const axios = require('axios');

exports.photos = () =>
  axios.get('https://jsonplaceholder.typicode.com/photos').then(response => {
    console.log(response);
  });
