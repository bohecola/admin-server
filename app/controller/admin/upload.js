const path = require('path');
const fse = require('fs-extra');
const { domain, port } = require('../../config');

// 大文件存储目录
const UPLOAD_DIR = path.resolve(__dirname, '../../', 'upload');

// 切片目录路径
const getChunkDir = (fileHash) => path.resolve(UPLOAD_DIR, `${fileHash}-chunks`);

// 提取文件后缀名
const extractExt = (filename) => filename.slice(filename.lastIndexOf('.'), filename.length);

// 上传 chunk
exports.uploadChunk = async (ctx) => {

  // 文件哈希，切片哈希（文件哈希-索引）
  const { fileHash, hash } = ctx.request.body;

  // 切片文件
  const chunk = ctx.request.file;

  // 切片目录路径
  const chunkDir = getChunkDir(fileHash);

  // 切片目录不存在，创建切片目录
  await fse.ensureDir(chunkDir);

  // 将切片文件移动到切片文件的目录中并重命名为 hash
  await fse.move(chunk.path, `${chunkDir}/${hash}`);

  ctx.success("上传成功")
}

// 上传验证
exports.verifyUpload = async (ctx) => {
  // 请求体
  const { fileHash, fileName } = ctx.request.body;

  // 文件的后缀名 eg: .mp4
  const ext = extractExt(fileName);

  // 文件路径
  const targetPath = path.resolve(UPLOAD_DIR, fileHash + ext);

  // 判断文件是否存在
  if (fse.existsSync(targetPath)) {
    // 合成后的文件存在，不需要上传
    ctx.success({ shouldUpload: false, url: `${domain}:${port}/upload/${fileHash}${ext}` })
  } else {
    // 切片目录路径
    const chunkDir = getChunkDir(fileHash);
    // 合成后的文件不存在
    const uploadedList = 
      // 切片目录存在
      fse.existsSync(chunkDir)
        // 读取切片目录下的所有文件
        ? await fse.readdir(chunkDir)
        // 切片目录不存在，返回空数组
        : [];
    
    // 返回已经上传的切片列表
    ctx.success({
      shouldUpload: true,
      uploadedList: uploadedList
    })
  }
}

// 合并 chunk
exports.mergeChunk = async (ctx) => {

  const { fileHash, fileName, splitSize, total } = ctx.request.body;

  // 切片的文件夹
  const chunkDir = getChunkDir(fileHash);

  // 切片路径列表
  const chunkPaths = await fse.readdir(chunkDir);

  if (chunkPaths.length !== total) {
    ctx.fail("切片文件数量不符合");
  }

  // 根据切片下标进行排序，直接读取目录获得的顺序可能会错乱
  chunkPaths.sort((a, b) => a.split("-")[1] - b.split("-")[1]);

  // 文件的后缀名 eg: .mp4
  const ext = extractExt(fileName);

  // 最终的文件路径
  const targetPath = path.resolve(UPLOAD_DIR, fileHash + ext);

  await Promise.all(
    chunkPaths.map((chunkPath, index) => {
      return pipeStream(
        path.resolve(chunkDir, chunkPath),
        // 指定位置创建可写流
        fse.createWriteStream(targetPath, {
          start: index * splitSize
        })
      );
    })
  );

  // 合并后删除保存切片的目录
  fse.rmdirSync(chunkDir); 

  // 返回文件地址给前端
  ctx.success({ url: `${domain}:${port}/upload/${fileHash}${ext}` })
}

// 读流 -> 写流
const pipeStream = (path, writeStream) =>
  new Promise((resolve) => {
    // 创建可读流
    const readStream = fse.createReadStream(path);

    // 监听读取完成
    readStream.on('end', () => {
      // 删除 chunk 文件
      fse.unlinkSync(path);
      resolve();
    });

    readStream.pipe(writeStream);
  });

