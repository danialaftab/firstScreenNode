'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Organizations', {
      id: {
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      login: {
        type: Sequelize.STRING
      },
      gravatar_id: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      avatar_url: {
        type: Sequelize.STRING
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Organizations');
  }
};