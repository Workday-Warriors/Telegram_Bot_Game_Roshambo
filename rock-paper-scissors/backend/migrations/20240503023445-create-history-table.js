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
    const enumValues = ['Rock', 'Paper', 'Scissors']
    await queryInterface.createTable(
      'history',
      {
        id: {
          type: Sequelize.DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        roomId: {
          type: Sequelize.DataTypes.BIGINT,
          allowNull: false,
        },
        walletAddress: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        stickerType: {
          type: Sequelize.ENUM(...enumValues),
          allowNull: false,
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
    await queryInterface.dropTable('history');
  }
};
