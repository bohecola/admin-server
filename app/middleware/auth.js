const jwt = require('jsonwebtoken');
const { tokenSecret } = require('../conf/secret');
const { User } = require('../model');

const auth = () => {
  return async (ctx, next) => {

    const whiteList = ['/login', '/posts'].map(path => `/api${path}`);

    const flag = whiteList.indexOf(ctx.path) !== -1;

    if (flag) return await next();

    const token = ctx.get('Authorization');

    if (!token) {
      ctx.status = 401;
      return ctx.fail('您可能没有权限访问该资源');
    }

    try {
      const res = jwt.verify(token, tokenSecret);

      const user = await User.findByPk(res.userId);

      ctx.user = user;

      await next();
    } catch(err) {
      ctx.throw(401, err);
    }
  }
}

module.exports = auth;