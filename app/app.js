const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');
const mount = require('koa-mount');
const parameter = require('koa-parameter');
const path = require('path');
const router = require('./router');
const sequelize = require('./database');
const auth = require('./middleware/auth');
const responseBody = require('./middleware/response');

const { User, Role, Menu } = require('./model');

User.belongsToMany(Role, { through: 'users_roles' });
Role.belongsToMany(Menu, { through: 'roles_menus' });
Menu.hasMany(Menu, { foreignKey: 'parentId' });

const app = new Koa();

app
  // 统一格式返回数据
  .use(responseBody())
  // 外层异常捕获中间件
  .use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = err.statusCode || 500;
      ctx.error(err);
    }
  });

app
  .use(auth())
  .use(bodyParser())
  .use(parameter(app))
  .use(mount('/public', static(path.join(__dirname, './public'))))
  .use(router.routes())
  .use(router.allowedMethods());

(async () => {
  try {
    await sequelize.sync({ alter: true });
    await sequelize.authenticate();
    const initialUser = await User.findAll();
    !initialUser.length && await User.create({ username: 'bohecola', password: '123456', email: 'bohecola@outlook.com' });

    const currentMenus = await Menu.findAll();
    !currentMenus.length && await Menu.bulkCreate([
      { name: '系统管理', type: 0, path: '/sys', icon: 'el-icon-setting' },
      { name: '用户列表', type: 1, path: '/sys/user', viewPath: 'views/user.vue', keepAlive: 1, parentId: 1 },
      { name: '角色列表', type: 1, path: '/sys/role', viewPath: 'views/role.vue', keepAlive: 1, parentId: 1 },
      { name: '菜单列表', type: 1, path: '/sys/menu', viewPath: 'views/menu.vue', keepAlive: 1, parentId: 1 }
    ]);
    console.log('Connection has been established successfully');

    app.listen(3000, () => {
      console.log('http://localhost:3000');
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();