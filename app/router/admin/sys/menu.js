const Router = require('@koa/router');
const router = new Router();

const menuController = require('../../../controller/admin/sys/menu');

router
  .prefix('/menu')
  .post('/add', menuController.add)
  .post('/delete', menuController.delete)
  .post('/update', menuController.update)
  .get('/info', menuController.info)
  .post('/list', menuController.list)
  .post('/page', menuController.page);

module.exports = router;