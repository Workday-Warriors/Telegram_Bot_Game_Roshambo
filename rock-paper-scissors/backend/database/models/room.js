module.exports = (sequelize, type) => sequelize.define(
    'rooms',
    {
      id: {
        type: type.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: type.STRING,
        allowNull: false,
      },
      finished: {
        type: type.TINYINT,
        defaultValue: 0,
      },
      winner: {
        type: type.STRING,
        allowNull: true,
      },
      prize: {
        type: type.BIGINT,
        defaultValue: 0,
      }
    },
    {
      timestamps: true,
    },
  );
  