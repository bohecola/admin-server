const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Menu = sequelize.define('menu', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    comment: '菜单id'
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    comment: '菜单名称'
  },
  path: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '节点路由'
  },
  type: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '菜单类型'
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    comment: '菜单图标'
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    comment: '上级菜单id'
  },
  viewPath: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    comment: '菜单视图文件路径'
  },
  hidden: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '菜单是否显示'
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '菜单是否启用'
  },
  sort: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '菜单排序'
  }
});

module.exports = Menu;