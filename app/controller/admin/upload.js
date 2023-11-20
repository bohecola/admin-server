const path = require('path');
const fse = require('fs-extra');

// 大文件存储目录
const UPLOAD_DIR = path.resolve(__dirname, '../../', 'upload');

// 提取文件后缀名
const extractExt = (filename) => filename.slice(filename.lastIndexOf('.'), filename.length);

// 上传 chunk
exports.uploadChunk = async (ctx) => {

  const {
    // 整个文件哈希
    fileHash,
    // 切片哈希（文件哈希-索引）
    hash,
  } = ctx.request.body;

  // 切片文件
  const chunk = ctx.request.file;

  // 切片目录路径
  const chunkDir = path.resolve(UPLOAD_DIR, `${fileHash}-chunks`);

  // 切片目录不存在，创建切片目录
  await fse.ensureDir(chunkDir);

  // 将切片文件移动到切片文件的目录中并重命名为 hash
  await fse.move(chunk.path, `${chunkDir}/${hash}`);

  ctx.success("上传成功")
}

// 合并 chunk
exports.mergeChunk = async (ctx) => {

  const { fileHash, fileName, splitSize, total } = ctx.request.body;

  // 切片的文件夹
  const chunkDir = path.resolve(UPLOAD_DIR, `${fileHash}-chunks`);

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

  ctx.success("合并成功")
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

