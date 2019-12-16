'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('users', 'type', Sequelize.STRING),

  down: queryInterface => queryInterface.removeColumn('users', 'type')
};
