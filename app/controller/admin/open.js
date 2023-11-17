const { User } = require('../../model');
const { readdirSync, statSync } = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const svgCaptcha = require('svg-captcha');
const svgToMiniDataURI = require('mini-svg-data-uri');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const { tokenSecret } = require('../../config/secret');
const { passwordEncryption } = require('../../utils/crypto');

// 登录
exports.login = async (ctx) => {

  ctx.verifyParams({
    username: 'string',
  });

  const { username, password, verifyCode } = ctx.request.body;

  // 验证码登录时校验
  if (ctx.session.verifyCode !== verifyCode) {
    return ctx.fail('验证码不正确');
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
    result.data = result.data['replace'](new RegExp(rp, 'g'), '#fff');
  });
  if (type === 'base64') {
    result.data = svgToMiniDataURI(result.data);
  }
  // 验证码生成时, 文字内容添加到 session 中
  ctx.session.verifyCode = svg.text.toLowerCase();
  ctx.success(result);
}

// 生成 token
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

// 存储扫码登录会话状态（实际应该存储在 redis 中）
const loginSessions = {};

// 二维码过期时间
const SEC = 1000;
const QR_CODE_EXPIRATION = 120 * SEC;

// 二维码生成
exports.qrcode = async (ctx) => {
  // 二维码 uuid
  const uuid = uuidv4();
  // 二维码过期时间
  const expiresAt = Date.now() + QR_CODE_EXPIRATION;

  // 存储会话状态
  loginSessions[uuid] = { 
    status: 'pending',
    expiresAt,
    userId: '' 
  };

  // 生成二维码
  const qrcode = await QRCode.toDataURL(uuid);

  ctx.success({
    uuid,
    qrcode
  })
}

// 二维码检查
exports.qrcodePoll = async (ctx) => {
  const { uuid } = ctx.query;

  // 判断二维码是否存在
  if (!uuid || !loginSessions[uuid]) {
    return ctx.fail('二维码不存在');
  }

  // 获取会话状态
  const session = loginSessions[uuid];

  // 判断二维码是否过期（这块后端应该设置一个定时任务，过期后自动更新状态或者删除二维码状态）
  if (session.expiresAt < Date.now()) {
    session.status = 'expired';
  }

  // 当状态为确认时，可以登录
  if (session.status === 'confirmed') {
    // 获取用户 id, 二维码状态
    const { userId, status } = session;
    // 删除会话
    delete loginSessions[uuid];
    // 生成 token
    const res = generateToken(userId);

    return ctx.success({
      status: status,
      ...res
    });
  }

  ctx.success({ status: session.status });

  // 当状态为过期时，可以删除会话
  if (session.status === 'expired') {
    delete loginSessions[uuid];
  }
}

// 标记二维码已扫描接口
exports.qrcodeScanned = async (ctx) => {
  const { uuid } = ctx.query;
  const { id } = ctx.user;

  if (uuid && loginSessions[uuid]) {
    loginSessions[uuid].status = 'scanned';
    loginSessions[uuid].userId = id;
    ctx.success('二维码已扫描，请在手机上确认登录')
  } else {
    ctx.fail('二维码不存在')
  }
}

// 同意授权接口
exports.qrcodeConfirm = async (ctx) => {
  const { uuid } = ctx.query;

  if (uuid && loginSessions[uuid]) {
    loginSessions[uuid].status = 'confirmed';

    ctx.success('已确认登陆');
  } else {
    ctx.fail('二维码不存在')
  }
}

// 取消授权接口
exports.qrcodeCancel = async (ctx) => {
  const { uuid } = ctx.query;

  if (uuid && loginSessions[uuid]) {
    loginSessions[uuid].status = 'expired';
    ctx.success('二维码已失效')
  } else {
    ctx.fail('二维码不存在')
  }
}

// 发现接口的接口
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