'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('commentReports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reportBy: {
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName:"users"
          },
          key:"id"
        }
      },
      commentId: {
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName:"comments"
          },
          key:"id"
        }
      },
      text: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('commentReports');
  }
};