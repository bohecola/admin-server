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
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    comment: '角色名称'
  },
  label: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
    defaultValue: null,
    comment: '角色标签'
  },
  remark: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    comment: '角色描述'
  },
  menus: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    comment: '角色菜单权限'
  }
});

module.exports = Role;