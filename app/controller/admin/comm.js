const { User } = require("../../model");
const config = require('../../config');

// 个人信息
exports.person = async (ctx) => {

  const { id } = ctx.user;

  const user = await User.findByPk(id, {
    attributes: { exclude: 'password' }
  });

  ctx.success(user);
}

// 修改个人信息
exports.personUpdate = async (ctx) => {

  const { user } = ctx;
  const { avatar, nickName, password } = ctx.request.body;

  user.avatar = avatar;
  user.nickName = nickName;

  if (password) {
    user.password = password;
    user.passwordV = user.passwordV + 1;
  };

  user.save();

  ctx.success();
}

// 权限菜单
exports.permmenu = async (ctx) => {
  const { id } = ctx.user;

  const user = await User.findByPk(id, {
    attributes: { exclude: 'password' },
    include: {
      association: 'roles',
      through: { attributes: [] },
      include: {
        association: 'menus',
        through: { attributes: [] }
      }
    }
  });

  // 获取用户的所有角色
  const { roles } = user;

  // 获取所有角色的菜单集合
  const menus = roles.reduce((prev, role) => {
    prev.push(...role.menus);
    return prev;
  }, []);

  // 去掉重复菜单
  for (let i=0; i<menus.length; i++) {
    for (let j=i+1; j<menus.length; j++) {
      if (menus[i].id === menus[j].id) {
        // 删除重复元素
        menus.splice(j, 1); // 后面元素会向前进一位
        j--; // 确保下一次比较的是[被删除元素]后一位的元素，需要j--
      }
    }
  }

  const permMenu = menus.sort((a, b) => a.orderNum - b.orderNum);

  ctx.success({ menus: permMenu, perms: [] });
}

// 文件上传
exports.upload = async (ctx) => {
  // 文件 file 对象
  // {
  //   fieldname: 'file',
  //   originalname: 'sai.jpeg',
  //   encoding: '7bit',
  //   mimetype: 'image/jpeg',
  //   destination: '/Users/bohe/admin-server/app/public/upload/20220819',
  //   filename: 'sai.jpeg',
  //   path: '/Users/bohe/admin-server/app/public/upload/20220819/sai.jpeg',
  //   size: 117641
  // }
  const { file } = ctx;

  // 文件访问路径
  const createURL = (filename) => {
    // 域名
    const domain = config.domain;
    const port = config.port;
    // 文件访问路径
    return `${domain}:${port}/${ctx.dirPath}/${filename}`;
  };

  if (file !== undefined && file) {
    ctx.success(createURL(file.filename));
  } else {
    ctx.throw(400, { message: "请选择需要上传的文件" });
  }
}

// 退出
exports.logout = async (ctx) => {

}