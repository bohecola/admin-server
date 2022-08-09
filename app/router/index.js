const Router = require('@koa/router');
const router = new Router();

const admin = require('./admin');
const posts = require('./posts');

router
  .prefix('/api')
  .use(admin.routes())
  .use(posts.routes());

module.exports = router;