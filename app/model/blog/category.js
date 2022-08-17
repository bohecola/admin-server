const { DataTypes } = require('sequelize');
const sequelize = require('../../database');

const Category = sequelize.define('category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '目录id'
  },
  // Required
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: '目录名称'
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    comment: "目录URL-Slug"
  }
});

module.exports = Category;