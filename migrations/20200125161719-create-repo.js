'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Repos', {
      id: {
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      name: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Repos');
  }
};