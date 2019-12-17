'use strict';

module.exports = {
  up: queryInterface =>
    queryInterface.addConstraint('albums_users', ['user_id', 'album_id'], {
      type: 'unique',
      name: 'unique_user_album'
    }),

  down: queryInterface => queryInterface.removeConstraint('albums_users', 'unique_user_album')
};
