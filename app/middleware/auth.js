const jwt = require('jsonwebtoken');
const { tokenSecret, refreshTokenSecret } = require('../conf/secret');
const { User } = require('../model');

const auth = () => {
  return async (ctx, next) => {

    if (ctx.url === '/login') {
      await next();
      return;
    }

    const token = ctx.get('Authorization');

    if (!token) {
      ctx.status = 401;
      return ctx.fail('您可能没有权限访问该资源');
    }

    const res = jwt.verify(token, tokenSecret);

    const user = await User.findByPk(res.userId);
    
    ctx.user = user;

    await next();
  }
}

module.exports = auth;