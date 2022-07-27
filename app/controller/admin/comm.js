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
  const { nickName, password } = ctx.request.body;

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
    prev.push(...role.menus)
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

}

// 退出
exports.logout = async (ctx) => {

}