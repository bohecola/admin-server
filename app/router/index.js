const Router = require('@koa/router');
const router = new Router();

const open = require('./open');
const comm = require('./comm');
const menu = require('./sys/menu');
const user = require('./sys/user');
const role = require('./sys/role');

router
  .prefix('/api')
  .use(open.routes())
  .use(comm.routes())
  .use(menu.routes())
  .use(user.routes())
  .use(role.routes());

module.exports = router;