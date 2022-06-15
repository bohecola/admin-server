const Router = require('@koa/router');
const router = new Router();

const categoryController = require('../../../controller/admin/blog/category');

router
  .prefix('/category')
  .post('/add', categoryController.add)
  .post('/delete', categoryController.delete)
  .post('/update', categoryController.update)
  .get('/info', categoryController.info)
  .get('/list', categoryController.list)
  .get('/page', categoryController.page);

module.exports = router;