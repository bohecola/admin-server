const Router = require('@koa/router');
const openController = require('../controller/admin/open');

const router = new Router();

router
  .post('/login', openController.login)
  .get('/eps', openController.getEps);

module.exports = router;