const { Sequelize } = require('sequelize');
const db = require('../conf/db');

const sequelize = new Sequelize({
  dialect: 'mysql',
  database: db.database,
  username: db.username,
  password: db.password,
  host: db.host,
  port: db.port
});

module.exports = sequelize;