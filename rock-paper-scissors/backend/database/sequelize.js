const Sequelize = require('sequelize');
const RoomModel = require('./models/room');
const HistoryModel = require('./models/history');
const UserModel = require('./models/user');
const GameModel = require('./models/game');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_UNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port: 3306,
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  },
  define: {
    freezeTableName: true,
  },
  logging: false,
  pool: { maxConnections: 5, maxIdleTime: 30 },
  language: 'en',
  timeout: 60000,
});

sequelize.authenticate().then(() => {
    console.info("Connection Established");
});

sequelize.sync().then(() => { console.log('Connected to database!'); }, (err) => {
  console.log('Error connecting to database:', err);
});

const Room = RoomModel(sequelize, Sequelize);
const History = HistoryModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);
const Game = GameModel(sequelize, Sequelize);

// History.belongsTo(Room, { foreignKey: 'roomId' });
// Room.hasMany(History);

module.exports = {
  sequelize,
  Room,
  History,
  User,
  Game
};
