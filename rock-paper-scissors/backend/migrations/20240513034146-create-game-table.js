'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable(
      'games',
      {
        id: {
          type: Sequelize.DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        walletAddress: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        rock: {
          type: Sequelize.DataTypes.BIGINT,
          defaultValue: 0,
        },
        scissors: {
          type: Sequelize.DataTypes.BIGINT,
          defaultValue: 0,
        },
        paper: {
          type: Sequelize.DataTypes.BIGINT,
          defaultValue: 0,
        },
        roomId: {
          type: Sequelize.DataTypes.BIGINT,
          defaultValue: 0
        },
        createdAt: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        }
      },
      {
        timestamps: true,
      },
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('games');
  }
};
