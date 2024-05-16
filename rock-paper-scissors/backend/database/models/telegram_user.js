module.exports = (sequelize, type) => sequelize.define(
    'telegram_user',
    {
      id: {
        type: type.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      chatId: {
        type: type.STRING,
        allowNull: false,
      }
    },
    {
      timestamps: true,
    },
  );
  