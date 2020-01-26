'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Events', {
      id: {
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      type: {
        type: Sequelize.STRING
      },
      actor_id: {
        type: Sequelize.INTEGER
      },
      repo_id: {  
        type: Sequelize.INTEGER
      },
      payload: {
        type: Sequelize.TEXT('long')
      },
      public: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      created_at: {
        allowNull: false,
        type: Sequelize.STRING
      },
      organization_id: {
        type: Sequelize.INTEGER
      },
    
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Events');
  }
};