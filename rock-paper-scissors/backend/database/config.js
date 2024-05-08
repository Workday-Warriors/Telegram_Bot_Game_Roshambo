require("dotenv").config();
module.exports = {
    development: {
      username: process.env.DB_UNAME,
      password: process.env.DB_PASSWORD,
      database: 'mydb',
      host: process.env.DB_HOST,
      dialect: 'mysql',
    },
    staging: {
      username: process.env.DB_UNAME,
      password: process.env.DB_PASSWORD,
      database: 'staging',
      host: process.env.DB_HOST,
      dialect: 'mysql',
    },
    production: {
      username: process.env.DB_UNAME,
      password: process.env.DB_PASSWORD,
      database: 'production',
      host: process.env.DB_HOST,
      dialect: 'mysql',
    },
  };
  