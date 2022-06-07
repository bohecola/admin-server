const { DataTypes } = require('sequelize');

const sequelize = require('../database');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    comment: '用户id'
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: '用户名'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '用户密码'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    comment: '用户姓名'
  },
  desc: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    comment: '用户描述'
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    comment: '用户头像'
  },
  // roleIds: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  //   defaultValue: null,
  //   comment: '用户角色'
  // }
});

module.exports = User;