const Router = require('@koa/router');
const openController = require('../../controller/admin/open');

const router = new Router();

router
  .prefix('/open')
  .post('/login', openController.login)
  .post('/refreshToken', openController.refreshToken)
  .get('/eps', openController.getEps);

module.exports = router;