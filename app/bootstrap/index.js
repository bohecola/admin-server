const sequelize = require('../database');
const { domain, port } = require("../config");
const initData = require("./data");
const path = require('path');
const fs = require('fs');
const https = require('https');

const options = {
  // 私钥
  key: fs.readFileSync(path.join(__dirname, '../keys/canday.site.key')),
  // 文件证书
  cert: fs.readFileSync(path.join(__dirname, '../keys/canday.site_bundle.crt'))
};

const bootstrap = async (app) => {
  try {
    // { force: true }
    // 连接数据库
    await sequelize.sync();
    await sequelize.authenticate();
    // 初始化系统数据
    await initData();
    console.log('Connection has been established successfully');

    // 启动应用服务
    if (process.env.NODE_ENV === 'production') {
      https
      .createServer(options, app.callback())
      .listen(port, () => {
        console.log(`${domain}:${port}`);
      });
    } else {
      app.listen(port, () => {
        console.log(`${domain}:${port}`);
      });
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = bootstrap;