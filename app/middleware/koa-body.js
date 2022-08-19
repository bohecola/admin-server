const koaBody = require("koa-body");
const dayjs = require("dayjs");
const path = require('path');
const fs = require("fs");

// 配置 koaBody
module.exports = (app) => {
  return koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, `../public/upload/`), // 设置文件上传目录
      keepExtensions: true,
      maxFieldsSize: 2 * 1024 * 1024,
      hashAlgorithm: 'sha1',
      onFileBegin: (name, file) => {
        // 上传文件目录相对路径
        const relativeUploadDirPath = `public/upload/${dayjs(new Date()).format("YYYYMMDD")}`;
        // 全局上下文添加相对路径
        app.context.relativeUploadDirPath = relativeUploadDirPath;
        // 上传文件目录绝对路径
        const uploadDirPath = path.resolve(
          __dirname,
          "../",
          relativeUploadDirPath
        );
        
        // 目录不存在，创建目录
        if (!fs.existsSync(uploadDirPath)) fs.mkdirSync(uploadDirPath);
        
        // 文件路径
        file.filepath = `${uploadDirPath}/${file.newFilename}`;
      }
    }
  });
}