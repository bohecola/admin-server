const multer = require('@koa/multer'); // 引入
const dayjs = require("dayjs");
const { v1: uuid } = require('uuid');
const path = require('path');
const fs = require("fs");

module.exports = (app) => {
  const storage = multer.diskStorage({
    // 配置上传文件目录
    destination: function(req, file, cb){
      console.log(file);
      // 目录相对路径
      const dirPath = app.context.dirPath = `public/upload/${dayjs(new Date()).format("YYYYMMDD")}`;
      // 目录绝对路径
      const absDirPath = path.join(
        __dirname,
        '../',
        dirPath
      );
      // 目录不存在，创建目录
      if (!fs.existsSync(absDirPath)) fs.mkdirSync(absDirPath);
      // 文件路径
      cb(null, absDirPath);
    },
    // 配置上传文件名
    filename: function(req, file, cb){
      // 扩展名
      const ext = file.originalname.substring(file.originalname.lastIndexOf('.'))
      cb(null, uuid() + ext);
    }
  })
  
  const upload = multer({
    storage: storage
  }); // 加载multer  

  return upload.single('file');
}