const Koa = require('koa');
const static = require('koa-static');
const mount = require('koa-mount');
const path = require('path');
const router = require('./router');
const sequelize = require('./database');

const { User, Role, Menu } = require('./model');

User.belongsToMany(Role, { through: 'users_roles' });
Role.belongsToMany(Menu, { through: 'roles_menus' });

const app = new Koa();

app
  .use(mount('/public', static(path.join(__dirname, './public'))))
  .use(router.routes())
  .use(router.allowedMethods());

(async () => {
  try {
    await sequelize.sync({ force: true });
    await sequelize.authenticate();
    console.log('Connection has been established successfully');

    app.listen(3000, () => {
      console.log('http://localhost:3000');
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();