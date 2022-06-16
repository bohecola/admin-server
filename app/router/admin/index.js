const Router = require('@koa/router');
const router = new Router();

const open = require('./open');
const comm = require('./comm');
const sys = require('./sys');
const blog = require('./blog');


router
  .prefix('/admin')
  .use(open.routes())
  .use(comm.routes())
  .use(sys.routes())
  .use(blog.routes());

module.exports = router;