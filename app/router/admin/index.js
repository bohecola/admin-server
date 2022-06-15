const Router = require('@koa/router');
const router = new Router();

const open = require('./open');
const comm = require('./comm');
const sys = require('./sys');


router
  .prefix('/admin')
  .use(open.routes())
  .use(comm.routes())
  .use(sys.routes());

module.exports = router;