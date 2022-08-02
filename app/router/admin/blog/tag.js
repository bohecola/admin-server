const Router = require('@koa/router');
const router = new Router();

const tagController = require('../../../controller/admin/blog/tag');

router
  .prefix('/tag')
  .post('/add', tagController.add)
  .post('/delete', tagController.delete)
  .post('/update', tagController.update)
  .get('/info', tagController.info)
  .post('/list', tagController.list)
  .post('/page', tagController.page);

module.exports = router;