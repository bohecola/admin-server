const { DataTypes } = require('sequelize');
const sequelize = require('../../database');

const Category = sequelize.define('category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '目录id'
  },
  // 无默认值，须传
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: '目录名称'
  }
});

module.exports = Category;