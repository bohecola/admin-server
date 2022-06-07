const { Sequelize } = require('sequelize');
const db = require('../conf/db');

const sequelize = new Sequelize(db.database, db.username, db.password, {
  dialect: 'mysql',
  host: db.host
});

module.exports = sequelize;