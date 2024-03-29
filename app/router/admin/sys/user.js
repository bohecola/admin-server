const Router = require('@koa/router');
const router = new Router();

const userController = require('../../../controller/admin/sys/user');

router
  .prefix('/user')
  .post('/add', userController.add)
  .post('/delete', userController.delete)
  .post('/update', userController.update)
  .get('/info', userController.info)
  .post('/list', userController.list)
  .post('/page', userController.page);

module.exports = router;