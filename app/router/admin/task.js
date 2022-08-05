const Router = require('@koa/router');
const taskController = require('../../controller/admin/task');

const router = new Router();

router
  .prefix('/task')
  .get('/clearJunkFiles', taskController.clearJunkFiles);

module.exports = router;