const Router = require('@koa/router');
const router = new Router();

const comm = require('./comm');
const menu = require('./menu');
const user = require('./user');
const role = require('./role');

router
  .use(comm.routes())
  .use(menu.routes())
  .use(user.routes())
  .use(role.routes());

module.exports = router;