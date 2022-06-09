const { Sequelize } = require('sequelize');
const db = require('../conf/db');

const sequelize = new Sequelize(db.database, db.username, db.password, {
  dialect: 'mysql',
  host: db.host,
  port: db.port,
  timezone: db.timezone,
  define: {
    paranoid: true
  },
  dialectOptions: {
    dateStrings: true,
    typeCast: true
  }
});

module.exports = sequelize;