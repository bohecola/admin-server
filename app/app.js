const Koa = require('koa');
const session = require('koa-session');
const static = require('koa-static');
const mount = require('koa-mount');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const parameter = require('koa-parameter');
const path = require('path');
const router = require('./router');
const auth = require('./middleware/auth');
const responseBody = require('./middleware/response');
const pagination = require('./middleware/pagination');
const bootstrap = require('./bootstrap');
const { sessionConfig } = require('./config');
const { sessionSecret } = require('./config/secret');

const { User, Role, Menu, Article, Category, Tag } = require('./model');

// 用户-角色 多对多关系 （仅设置一个用户可以添加多个角色）
User.belongsToMany(Role, { through: 'users_roles' });
// 角色-菜单 多对多关系 （仅设置一个角色可以添加多个菜单）
Role.belongsToMany(Menu, { through: 'roles_menus' });
// 自关联 菜单-菜单 一对多关系  （一个菜单可以添加多个子菜单），一个菜单可以有多个子级菜单，但同时一个菜单只能有一个父级菜单
Menu.hasMany(Menu, { foreignKey: 'parentId' });

// 文章-标签 多对多关系 （一个文章可以添加多个标签）
Article.belongsToMany(Tag, { through: 'articles_tags' });
// 标签-文章 多对多关系 （一个标签可以添加多个文章）
Tag.belongsToMany(Article, { through: 'articles_tags' });

// 目录-文章 一对多关系 （一个目录可以添加多个文章），文章表设置名为categoryId的外键，默认为目录表的主键
Category.hasMany(Article);
Article.belongsTo(Category);

User.hasMany(Article, { foreignKey: 'createdBy' });
User.hasMany(Category, { foreignKey: 'createdBy' });
User.hasMany(Tag, { foreignKey: 'createdBy' });
User.hasMany(Article, { foreignKey: 'updatedBy' });
User.hasMany(Category, { foreignKey: 'updatedBy' });
User.hasMany(Tag, { foreignKey: 'updatedBy' });

const app = new Koa();
app.keys = [sessionSecret];
app
  // 外层异常捕获中间件
  .use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      console.log(err);
      ctx.status = err.statusCode || err.status || 500;
      ctx.error(err);
    }
  })
  // 跨域
  .use(cors({
    credentials: true
  }))
  // session
  .use(session(sessionConfig, app))
  // 挂载返回统一格式数据方法
  .use(responseBody())
  // 静态资源访问
  .use(mount('/public', static(path.join(__dirname, 'public'))))
  .use(mount('/upload', static(path.join(__dirname, 'upload'))))
  // token认证
  .use(auth())
  // 请求体解析
  .use(bodyParser())
  // 请求参数校验
  .use(parameter(app))
  // 挂载分页方法
  .use(pagination())
  .use(router.routes())
  .use(router.allowedMethods());

// 启动程序
bootstrap(app);