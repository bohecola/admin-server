const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const { passwordEncryption } = require('../utils/crypto');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    comment: '用户id'
  },
  // 无默认值，须传
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: '用户名'
  },
  // 无默认值，须传
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('password', passwordEncryption(this.username + value));
    },
    comment: '用户密码'
  },
  name: {
    type: DataTypes.STRING,
    comment: '用户姓名'
  },
  email: {
    type: DataTypes.STRING,
    comment: '用户邮箱'
  },
  desc: {
    type: DataTypes.STRING,
    comment: '用户描述'
  },
  avatar: {
    type: DataTypes.STRING,
    comment: '用户头像'
  }
});

module.exports = User;