const Router = require('@koa/router');
const openController = require('../../controller/admin/open');

const router = new Router();

router
  .prefix('/open')
  .get('/captcha', openController.captcha)
  .post('/login', openController.login)
  .post('/refreshToken', openController.refreshToken)
  .get('/qrcode', openController.qrcode)
  .get('/qrcodePoll', openController.qrcodePoll)
  .get('/qrcodeScanned', openController.qrcodeScanned)
  .get('/qrcodeConfirm', openController.qrcodeConfirm)
  .get('/qrcodeCancel', openController.qrcodeCancel)
  .get('/eps', openController.getEps);

module.exports = router;