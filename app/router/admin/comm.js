const Router = require('@koa/router');
const commController = require('../../controller/admin/comm');

const router = new Router();

router
  .prefix('/comm')
  .post('/personUpdate', commController.personUpdate)
  .get('/person', commController.person)
  .get('/permmenu', commController.permmenu)
  .get('/upload', commController.upload);

module.exports = router;