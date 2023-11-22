const Router = require('@koa/router');
const multer = require('@koa/multer');

// 控制器
const uploadController = require('../../controller/admin/upload');
const path = require('path');

// 路由
const router = new Router();

// 存储目录
const dest = path.resolve(__dirname, '../../', 'tmp');

// multer
const upload = multer({ dest }); 

router.
  prefix('/upload')
  .post('/chunk',
    upload.single('chunk'),
    uploadController.uploadChunk
  )
  .post('/merge', uploadController.mergeChunk)
  .post('/verify', uploadController.verifyUpload);

module.exports = router;
