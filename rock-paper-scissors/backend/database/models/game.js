module.exports = (sequelize, type) => sequelize.define(
    'games',
    {
      id: {
        type: type.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      walletAddress: {
        type: type.STRING,
        allowNull: false,
      },
      sticker: {
        type: type.BIGINT,
        defaultValue: 0,
      },
      roomId: {
        type: type.BIGINT,
        defaultValue: 0
      }
    },
    {
      timestamps: true,
    },
  );
  