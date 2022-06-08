const { DataTypes } = require('sequelize');

const sequelize = require('../database');

const Role = sequelize.define('role', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    comment: '角色id'
  },
  // 无默认值，须传
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    comment: '角色名称'
  },
  label: {
    type: DataTypes.STRING,
    unique: true,
    comment: '角色标签'
  },
  remark: {
    type: DataTypes.STRING,
    comment: '角色描述'
  }
});

module.exports = Role;