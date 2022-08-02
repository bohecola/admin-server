const Router = require('@koa/router');
const router = new Router();

const roleController = require('../../../controller/admin/sys/role');

router
  .prefix('/role')
  .post('/add', roleController.add)
  .post('/delete', roleController.delete)
  .post('/update', roleController.update)
  .get('/info', roleController.info)
  .post('/list', roleController.list)
  .post('/page', roleController.page);

module.exports = router;