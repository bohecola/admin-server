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
    defaultValue: 1,
    comment: '文章状态'
  },
  categoryId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'categories',
      key: 'id'
    },
    comment: '文章目录id'
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: '文章创建人id'
  }
});

module.exports = Article;