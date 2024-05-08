module.exports = (sequelize, type) => sequelize.define(
    'history',
    {
      id: {
        type: type.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      roomId: {
        type: type.BIGINT,
        allowNull: false,
      },
      walletAddress: {
        type: type.STRING,
        allowNull: false,
      },
      stickerType: {
        type: type.ENUM('Rock', 'Paper', 'Scissors'),
        allowNull: false,
      }
    },
    {
      timestamps: true,
    },
  );
  