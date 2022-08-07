const { User } = require('../../model');
const jwt = require('jsonwebtoken');
const svgCaptcha = require('svg-captcha');
const svgToMiniDataURI = require('mini-svg-data-uri');
const { tokenSecret } = require('../../config/secret');
const { passwordEncryption } = require('../../utils/crypto');
const { readdirSync, statSync } = require('fs');
const path = require('path');

// 登录
exports.login = async (ctx) => {

  ctx.verifyParams({
    username: 'string',
  });

  const { username, password, verifyCode } = ctx.request.body;

  console.log(typeof ctx.session.verifyCode, typeof verifyCode);
  console.log(ctx.session.verifyCode, verifyCode, 2222222);

  if (ctx.session.verifyCode !== verifyCode) {
    return ctx.fail('验证码错误');
  }

  const user = await User.findOne({ where: { username: username } });

  // 用户不存在或密码不正确
  const flag = !user || passwordEncryption(username + password) !== user.password;

  if (flag) {
    return ctx.fail('账户或密码不正确');
  }

  // 账户被禁用
  if (!user.status) {
    return ctx.fail('账户已被禁用');
  }

  const res = generateToken(user.id);

  ctx.success(res);
}

// 刷新 token
exports.refreshToken = async (ctx) => {
  try {
    const { userId } = jwt.verify(ctx.request.body.refreshToken, tokenSecret);

    const res = generateToken(userId);

    ctx.success(res);
  } catch(err) {
    ctx.throw(401, err);
  }
}

// 验证码
exports.captcha = async (ctx) => {
  const { type = '', width = 150, height = 50 } = ctx.query;

  const svg = svgCaptcha.create({
    ignoreChars: 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM',
    width: Number(width),
    height: Number(height)
  });
  const result = {
    data: svg.data.replace(/"/g, "'")
  };
  // 文字变白
  const rpList = [
    '#111',
    '#222',
    '#333',
    '#444',
    '#555',
    '#666',
    '#777',
    '#888',
    '#999',
  ];
  rpList.forEach(rp => {
    result.data = result.data['replaceAll'](rp, '#fff');
  });
  if (type === 'base64') {
    result.data = svgToMiniDataURI(result.data);
  }
  // 添加 session
  ctx.session.verifyCode = svg.text.toLowerCase();
  console.log(ctx.session.verifyCode, 1111111);
  ctx.success(result);
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