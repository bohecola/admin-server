const Router = require('@koa/router');
const multer = require('@koa/multer');

// 控制器
const uploadController = require('../../controller/admin/upload');
const path = require('path');

// 路由
const router = new Router();

// multer
const upload = multer({ dest: path.resolve(__dirname, '../../', 'tmp') }); 

router.
  prefix('/upload')
  .post('/chunk',
    upload.single('chunk'),
    uploadController.uploadChunk
  )
  .post('/merge', uploadController.mergeChunk);

module.exports = router;
