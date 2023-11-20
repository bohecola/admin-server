const Router = require('@koa/router');
const router = new Router();

const sys = require('./sys');
const comm = require('./comm');
const task = require('./task');
const upload = require('./upload');
const open = require('./open');
const blog = require('./blog');

router
  .prefix('/admin')
  .use(sys.routes())
  .use(comm.routes())
  .use(task.routes())
  .use(upload.routes())
  .use(open.routes())
  .use(blog.routes());

module.exports = router;