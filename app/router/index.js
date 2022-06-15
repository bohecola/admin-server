const Router = require('@koa/router');
const router = new Router();

const admin = require('./admin');

router
  .prefix('/api')
  .use(admin.routes());

module.exports = router;