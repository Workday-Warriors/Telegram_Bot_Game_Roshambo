module.exports = (sequelize, type) => sequelize.define(
    'game_remain_token_count',
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
      rock: {
        type: type.BIGINT,
        defaultValue: 0,
      },
      scissors: {
        type: type.BIGINT,
        defaultValue: 0,
      },
      paper: {
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
  