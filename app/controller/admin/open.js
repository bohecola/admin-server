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

  const dirs = readdirSync(__dirname).filter(name => {
    const stat = statSync(path.join(__dirname, name));
    return stat.isDirectory();
  });

  const apis = dirs.reduce((prev, dirName) => {

    const ctrlFiles = readdirSync(path.join(__dirname, dirName));


    ctrlNamespaces.map(namespace => {
    
    });

    return prev;
  }, []);

  // const apiCollection = moduleDirs.reduce((prev, moduleName) => {
  
  //   const controllerFiles = readdirSync(resolve(__dirname, moduleName));

  //   const controllers = controllerFiles.map((ctrlFileName) => {
  //     return ctrlFileName.substring(0, ctrlFileName.indexOf('.'));
  //   });
  
  //   const moduleApis = controllers.map(ctrlName => `${moduleName}/${ctrlName}`);
  
  //   prev.push(...moduleApis);

  //   return prev;
  // }, []);

  // const arr = apiCollection.map(path => {
  //   const module = require(resolve(__dirname, path));
  //   Object.keys(module);
  //   return 
  // });

  ctx.success()
}