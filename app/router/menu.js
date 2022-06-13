const Router = require('@koa/router');
const router = new Router();

const menuController = require('../controller/menu');

router
  .prefix('/menu')
  .post('/add', menuController.add)
  .post('/delete', menuController.delete)
  .post('/update', menuController.update)
  .get('/info', menuController.info)
  .get('/list', menuController.list);

module.exports = router;