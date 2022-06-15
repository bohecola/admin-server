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

exports.getEps = async (ctx) => {

  const namespaces = readdirSync(__dirname).filter(namespace => {

    const stat = statSync(path.join(__dirname, namespace));

    return stat.isDirectory();
  });

  const apis = namespaces.reduce((prev, namespace) => {

    const controllerNames = readdirSync(path.join(__dirname, namespace)).map(filename => filename.substring(0, filename.indexOf('.')));

    controllerNames.forEach(controllerName => {

      const controllerPath = path.join(__dirname, `${namespace}/${controllerName}`);

      const controller = require(controllerPath);

      Object.keys(controller).forEach(methodName => {
        prev.push(`${namespace}/${controllerName}/${methodName}`);
      });
    });

    return prev;
  }, []);

  ctx.success(apis)
}