const { Sequelize } = require('sequelize');
const db = require('../config/db');

const sequelize = new Sequelize(db.database, db.username, db.password, {
  dialect: 'mysql',
  host: db.host,
  port: db.port,
  timezone: db.timezone,
  // define: {
  //   paranoid: true
  // },
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
    charset: db.charset
  },
  logging: false
});

module.exports = sequelize;