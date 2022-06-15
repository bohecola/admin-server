const Router = require('@koa/router');
const router = new Router();

const articleController = require('../../../controller/admin/blog/article');

router
  .prefix('/article')
  .post('/add', articleController.add)
  .post('/delete', articleController.delete)
  .post('/update', articleController.update)
  .get('/info', articleController.info)
  .get('/list', articleController.list)
  .get('/page', articleController.page);

module.exports = router;