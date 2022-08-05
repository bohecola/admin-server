const jwt = require('jsonwebtoken');
const { tokenSecret } = require('../config/secret');
const { User } = require('../model');

const auth = () => {
  return async (ctx, next) => {

    const whiteList = ['/post'].map(path => `/api${path}`);

    const openApis = ['/login', '/refreshToken', '/eps'].map(path => `/api/admin/open${path}`);

    whiteList.push(...openApis);

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
    } catch(err) {
      ctx.throw(401, err);
    }
    await next();
  }
}

module.exports = auth;