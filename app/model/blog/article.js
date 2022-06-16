const { DataTypes } = require('sequelize');
const sequelize = require('../../database');

const Article = sequelize.define('article', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '文章id'
  },
  // 无默认值，须传
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
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
    comment: '文章状态'
  }
});

module.exports = Article;