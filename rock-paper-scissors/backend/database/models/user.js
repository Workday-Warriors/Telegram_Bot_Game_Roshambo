module.exports = (sequelize, type) => sequelize.define(
    'tbl_user',
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
      stickerCount: {
        type: type.BIGINT,
        allowNull: false,
      },
      is_del: {
        type: type.TINYINT,
        defaultValue: false,
      }
    },
    {
      timestamps: true,
    },
  );
  