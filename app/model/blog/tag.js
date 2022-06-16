const { DataTypes } = require('sequelize');
const sequelize = require('../../database');

const Tag = sequelize.define('tag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '标签id'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '标签名称'
  }
});

module.exports = Tag;