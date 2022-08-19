const Router = require('@koa/router');
const commController = require('../../controller/admin/comm');

const multer = require('@koa/multer'); // 引入
const upload = multer(); // 加载multer  

const router = new Router();

router
  .prefix('/comm')
  .post('/personUpdate', commController.personUpdate)
  .get('/person', commController.person)
  .get('/permmenu', commController.permmenu)
  .post(
    '/upload', 
    upload.fields([
      {
        name: 'file',
        maxCount: 1
      }
    ]), 
    commController.upload
  );

module.exports = router;