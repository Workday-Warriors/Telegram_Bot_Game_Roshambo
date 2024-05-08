module.exports = (sequelize, type) => sequelize.define(
    'room',
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
      }
    },
    {
      timestamps: true,
    },
  );
  