const { DataTypes } = require('sequelize');
const sequelize = require('../../database');
const { passwordEncryption } = require('../../utils/crypto');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    comment: '用户id'
  },
  // Required
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: '用户名'
  },
  // Required
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('password', passwordEncryption(this.username + value));
    },
    comment: '用户密码'
  },
  passwordV: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '密码版本'
  },
  nickName: {
    type: DataTypes.STRING,
    comment: '用户昵称'
  },
  name: {
    type: DataTypes.STRING,
    comment: '用户姓名'
  },
  email: {
    type: DataTypes.STRING,
    comment: '用户邮箱'
  },
  phone: {
    type: DataTypes.STRING,
    comment: '手机号码'
  },
  desc: {
    type: DataTypes.STRING,
    comment: '用户描述'
  },
  avatar: {
    type: DataTypes.STRING,
    comment: '用户头像'
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 1,
    comment: '账户状态'
  }
});

module.exports = User;