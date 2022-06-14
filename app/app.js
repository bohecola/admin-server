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
const pagination = require('./middleware/pagination');

const { User, Role, Menu } = require('./model');

User.belongsToMany(Role, { through: 'users_roles' });
Role.belongsToMany(Menu, { through: 'roles_menus' });
Menu.hasMany(Menu, { foreignKey: 'parentId' });

const app = new Koa();

app
  // 挂载返回统一格式数据方法
  .use(responseBody())
  // 挂载分页方法
  .use(pagination())
  // 外层异常捕获中间件
  .use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      console.log(err)
      ctx.status = err.statusCode || 500;
      ctx.error(err);
    }
  });

app
  // token认证
  .use(auth())
  // 请求体解析
  .use(bodyParser())
  // 请求参数校验
  .use(parameter(app))
  // 静态资源访问
  .use(mount('/public', static(path.join(__dirname, './public'))))
  .use(router.routes())
  .use(router.allowedMethods());

(async () => {
  try {
    await sequelize.sync();
    await sequelize.authenticate();
    const initialUser = await User.findAll();
    !initialUser.length && await User.create({ username: 'bohecola', password: '123456', email: 'bohecola@outlook.com' });

    const currentMenus = await Menu.findAll();
    !currentMenus.length && await Menu.bulkCreate([
      { name: '系统管理', type: 0, path: '/sys', icon: 'el-icon-setting' },
      { name: '用户列表', type: 1, path: '/sys/user', viewPath: 'views/user.vue', keepAlive: 1, parentId: 1 },
      { name: '角色列表', type: 1, path: '/sys/role', viewPath: 'views/role.vue', keepAlive: 1, parentId: 1 },
      { name: '菜单列表', type: 1, path: '/sys/menu', viewPath: 'views/menu.vue', keepAlive: 1, parentId: 1 },
      { name: '新增', type: 2,  perms: 'sys:user:add', parentId: 2},
      { name: '删除', type: 2,  perms: 'sys:user:delete', parentId: 2},
      { name: '修改', type: 2,  perms: 'sys:user:update', parentId: 2},
      { name: '查询', type: 2,  perms: 'sys:user:page,sys:user:list,sys:user:info', parentId: 2},
      { name: '新增', type: 2,  perms: 'sys:role:add', parentId: 3},
      { name: '删除', type: 2,  perms: 'sys:role:delete', parentId: 3},
      { name: '修改', type: 2,  perms: 'sys:role:update', parentId: 3},
      { name: '查询', type: 2,  perms: 'sys:role:page,sys:role:list,sys:role:info', parentId: 3},
      { name: '新增', type: 2,  perms: 'sys:menu:add', parentId: 4},
      { name: '删除', type: 2,  perms: 'sys:menu:delete', parentId: 4},
      { name: '修改', type: 2,  perms: 'sys:menu:update', parentId: 4},
      { name: '查询', type: 2,  perms: 'sys:menu:page,sys:menu:list,sys:menu:info', parentId: 4},
    ]);
    console.log('Connection has been established successfully');

    app.listen(3000, () => {
      console.log('http://localhost:3000');
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();