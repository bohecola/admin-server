const { User } = require("../../model");

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
  // 文件 key-value 对象
  const { files } = ctx.request;

  // 文件访问路径
  const createURL = (filename) => {
    // 域名
    const domain = "http://localhost:3000";
    // 文件访问路径
    return `${domain}/${ctx.relativeUploadDirPath}/${filename}`;
  };

  if (files !== undefined && files["file"]) {
    // 地址数组或字符串
    let res;
    // 多文件上传
    if (Array.isArray(files["file"])) {
      // 文件地址数组
      res = files["file"].reduce((prev, file) => {
        prev.push(
          createURL(file.newFilename)
        );
        return prev;
      }, []);
    } 
    // 单文件上传
    else {
      // 文件地址
      res = createURL(files["file"].newFilename);
    }
    ctx.success(res);
  } else {
    ctx.throw(400, { message: "请选择需要上传的文件" });
  }
}

// 退出
exports.logout = async (ctx) => {

}