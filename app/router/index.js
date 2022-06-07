const Router = require('@koa/router');
const router = new Router();

const menu = require('./menu');
const user = require('./user');
const role = require('./role');

router
  .use(menu.routes())
  .use(user.routes())
  .use(role.routes());

module.exports = router;