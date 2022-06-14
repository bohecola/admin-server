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
  // 无默认值，须传
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '菜单名称'
  },
  // 无默认值，须传
  type: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '菜单类型'
  },
  path: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '节点路由'
  },
  viewPath: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '菜单视图文件路径'
  },
  perms: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '操作权限'
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '菜单图标'
  },
  keepAlive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
    comment: '路由缓存',
    get() {
      return this.getDataValue('keepAlive') ? true : false;
    },
    set(value) {
      this.setDataValue('keepAlive', value ? 1 : 0);
    }
  },
  isShow: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 1,
    comment: '菜单是否显示',
    get() {
      return this.getDataValue('isShow') ? true : false;
    },
    set(value) {
      this.setDataValue('isShow', value ? 1 : 0);
    }
  },
  orderNum: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
    comment: '菜单排序'
  }
});

module.exports = Menu;