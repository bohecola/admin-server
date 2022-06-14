const Router = require('@koa/router');
const commController = require('../controller/admin/comm');

const router = new Router();

router
  .post('/personUpdate', commController.personUpdate)
  .get('/person', commController.person)
  .get('/permmenu', commController.permmenu)
  .get('/person', commController.person)
  .get('/upload', commController.upload);

module.exports = router;