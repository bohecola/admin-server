const { User, Article } = require("../../model");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");

exports.clearJunkFiles = async (ctx) => {

  // 获取所有用户头像数据
  const users = await User.findAll({ 
    where: { 
      avatar: {
        [Op.not]: null
      }
    },
    attributes: ["avatar"]
  });

  // 获取博客数据
  const articles = await Article.findAll({
    where: {
      content: {
        [Op.not]: null
      }
    }
  });

  // 用户头像中引用的文件链接地址
  const avatarURL = users.map(user => user.avatar);

  // 所有博客内容数组
  const allArticleContent = articles.map(article => article.content);

  const getDomStrSrcURLArr = (s) => {
    // 匹配 img video source 标签
    const tagReg = /(<img.*?(?:>|\/>))|(<video.*?(?:>|\/>))|(<source.*?(?:>|\/>))/gi;
    // 匹配 src=""
    const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/gi;
    // 得到所有 img video source标签
    const tagsArr = s.match(tagReg);
    // 得到所有标签的 src=""
    const srcArr = tagsArr.map((tagStr) => tagStr.match(srcReg)[0]);
    // 得到链接数组
    const urlArr = srcArr.map(src => src.replace("src=\"", "").replace("\"", ""));
    // 返回
    return urlArr;
  };

  // 博客中引用的文件链接地址
  const articleURL = allArticleContent.reduce((prev, content) => {
    prev.push(...getDomStrSrcURLArr(content));
    return prev;
  }, []);
  
  // 截取 upload 目录后的路径
  const relativeUploadDirPath = (p) => p.substring(p.lastIndexOf("/") - 9);

  // 当前在数据库中被引用的文件相对于 upload 目录的地址（/目录名/文件名）
  const referencedFiles = [...avatarURL, ...articleURL].map((p) => relativeUploadDirPath(p));

  // upload 目录路径
  const uploadPath = path.resolve(__dirname, "../../", "./public/upload");

  // 已上传文件目录集合(绝对路径)
  const uploadFileDirPaths = fs.readdirSync(uploadPath).map((dirName) => `${uploadPath}/${dirName}`);

  // 已上传文件集合(绝对路径)
  const uploadFilePaths = uploadFileDirPaths.reduce((prev, fileDirPath) => {
    prev.push(
      ...(fs.readdirSync(fileDirPath).map(filename => `${fileDirPath}/${filename}`))
    );
    return prev;
  }, []);

  // 被移除文件的集合(绝对路径)
  const droppedFilePaths = uploadFilePaths.reduce((prev, filePath) => {
    if (referencedFiles.indexOf(relativeUploadDirPath(filePath)) < 0) prev.push(filePath);
    return prev;
  }, []);

  // 删除需要移除的的文件
  droppedFilePaths.forEach((droppedFilePath) => {
    if (fs.existsSync(droppedFilePath)) {
      fs.unlinkSync(droppedFilePath);
    }
  });

  ctx.success(
    droppedFilePaths.length 
      ? `${droppedFilePaths.map(p => relativeUploadDirPath(p))} 共 ${droppedFilePaths.length} 个文件被删除` 
      : `没有可清理的垃圾文件`
  );
}