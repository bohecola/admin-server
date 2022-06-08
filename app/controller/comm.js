const { User } = require('../model');
const jwt = require('jsonwebtoken');
const { tokenSecret, refreshTokenSecret } = require('../conf/secret');
const { passwordEncryption } = require('../utils/crypto');

exports.login = async (ctx) => {

  ctx.verifyParams({
    username: 'string',
    password: 'password'
  });

  const { username, password } = ctx.request.body;

  const user = await User.findOne({ where: { username: username } });

  // 用户不存在或密码不正确
  const flag = !user || passwordEncryption(password) !== user.password;

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
    refreshTokenSecret,
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