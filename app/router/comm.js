const Router = require('@koa/router');
const commController = require('../controller/comm');

const router = new Router();

router
  .post('/login', commController.login);

module.exports = router;