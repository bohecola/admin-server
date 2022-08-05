const { DataTypes } = require('sequelize');
const sequelize = require('../../database');

const Article = sequelize.define('article', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '文章id'
  },
  // Required
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: '文章标题'
  },
  content: {
    type: DataTypes.TEXT,
    comment: '文章内容'
  },
  desc: {
    type: DataTypes.STRING,
    comment: '文章简介'
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    comment: 'URL-Slug'
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '文章状态'
  }
});

module.exports = Article;