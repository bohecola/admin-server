const sequelize = require('../database');
const { domain, port } = require("../config");
const initData = require("./data");

const bootstrap = async (app) => {
  try {
    // { force: true }
    // 连接数据库
    await sequelize.sync();
    await sequelize.authenticate();
    // 初始化系统数据
    await initData();
    console.log('Connection has been established successfully');

    app.listen(port, () => {
      console.log(`${domain}:${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = bootstrap;