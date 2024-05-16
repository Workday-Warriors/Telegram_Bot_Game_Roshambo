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
      stickerNum: {
        type: type.BIGINT,
        defaultValue: 0
      }
    },
    {
      timestamps: true,
    },
  );
  