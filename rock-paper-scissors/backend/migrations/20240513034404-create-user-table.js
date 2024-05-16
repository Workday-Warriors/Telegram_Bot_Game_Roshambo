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
      'users',
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
        stickerCount: {
          type: Sequelize.DataTypes.BIGINT,
          allowNull: false,
        },
        is_del: {
          type: Sequelize.DataTypes.TINYINT,
          defaultValue: false,
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
    await queryInterface.dropTable('users');
  }
};
