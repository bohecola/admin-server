const { User } = require('../../model');
const jwt = require('jsonwebtoken');
const { tokenSecret } = require('../../config/secret');
const { passwordEncryption } = require('../../utils/crypto');
const { readdirSync, statSync } = require('fs');
const path = require('path');

exports.login = async (ctx) => {

  ctx.verifyParams({
    username: 'string',
  });

  const { username, password } = ctx.request.body;

  const user = await User.findOne({ where: { username: username } });

  // 用户不存在或密码不正确
  const flag = !user || passwordEncryption(username + password) !== user.password;

  if (flag) {
    return ctx.fail('账户或密码不正确');
  }

  const res = generateToken(user.id);

  ctx.success(res);
}

exports.refreshToken = async (ctx) => {
  try {
    const { userId } = jwt.verify(ctx.request.body.refreshToken, tokenSecret);

    const res = generateToken(userId);

    ctx.success(res);
  } catch(err) {
    ctx.throw(401, err);
  }
}

function generateToken(userId) {
  const tokenHour = 2;
  const refreshTokenHour = 36;
  const secondsOfHour = 60 * 60;

  const token = jwt.sign(
    { userId: userId },
    tokenSecret,
    { expiresIn: `${tokenHour}h` }
  );

  const refreshToken = jwt.sign(
    { userId: userId },
    tokenSecret,
    { expiresIn: `${refreshTokenHour}h` }
  );

  const res = {
    expire: tokenHour * secondsOfHour,
    token: token,
    refreshExpire: refreshTokenHour * secondsOfHour,
    refreshToken: refreshToken
  };

  return res;
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