const dayjs = require("dayjs");
const fs = require("fs");

// 目录是否存在
exports.checkDirExist = (p) => {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p);
  }
}

// 获取文件扩展名
exports.getFileExt = (name) => {
  const ext = name.split(".");
  return ext[ext.length - 1];
}

// 上传文件保存目录名称
exports.getUploadDirName = () => {
  const date = new Date();

  // const Year = date.getFullYear();

  // const Month = date.getMonth() + 1;

  // const Day = date.getDate();

  // const fillZero = (num) => num < 10 ? `0${num}` : num;

  // return `${Year}${fillZero(Month)}${fillZero(Day)}`;
  console.log(dayjs(date).format('YYYYMMDD'));
  return dayjs(date).format('YYYYMMDD');
}