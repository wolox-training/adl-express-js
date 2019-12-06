'use strict';
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('albums', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }),
  down: queryInterface => queryInterface.dropTable('albums')
};
