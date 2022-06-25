const { User } = require('../../model');
const jwt = require('jsonwebtoken');
const { tokenSecret } = require('../../conf/secret');
const { passwordEncryption } = require('../../utils/crypto');
const { readdirSync, statSync } = require('fs');
const path = require('path');

exports.login = async (ctx) => {

  ctx.verifyParams({
    username: 'string',
    password: 'password'
  });

  const { username, password } = ctx.request.body;

  const user = await User.findOne({ where: { username: username } });

  // 用户不存在或密码不正确
  const flag = !user || passwordEncryption(username + password) !== user.password;

  if (flag) {
    return ctx.fail('账户或密码不正确');
  }

  const token = jwt.sign(
    { userId: user.id },
    tokenSecret,
    { expiresIn: '2h' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    tokenSecret,
    { expiresIn: '36h' }
  );

  const hour = 60 * 60;

  const res = {
    expire: 2 * hour,
    token: token,
    refreshExpire: 36 * hour,
    refreshToken: refreshToken
  };

  ctx.success(res);
}

function readFileList(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach((item, index) => {
    const fullPath = path.join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      readFileList(path.join(dir, item), fileList)
    } else {
      fileList.push(fullPath);
    }
  });
  
  return fileList;
}

exports.getEps = async (ctx) => {

  const fileList = readFileList(__dirname);

  const apis = fileList.reduce((prev, filePath) => {

    const controller = require(filePath);

    Object.keys(controller).forEach(methodName => {

      const relativePath = filePath.replace(__dirname, '');

      const apiPath = relativePath.replace('.js', `/${methodName}`);

      prev.push(apiPath);
    });

    return prev;
  }, []);

  ctx.success(apis);
}