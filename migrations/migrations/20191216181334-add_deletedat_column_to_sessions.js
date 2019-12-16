'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('sessions', 'deleted_at', Sequelize.DATE),

  down: queryInterface => queryInterface.removeColumn('sessions', 'deleted_at')
};
