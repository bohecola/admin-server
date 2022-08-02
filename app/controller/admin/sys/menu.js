const { Menu } = require("../../../model");
const { menuValidator } = require('../../../validator');

exports.add = async (ctx) => {

  ctx.verifyParams(menuValidator);

  const { parentId } = ctx.request.body;

  if (parentId) {
    const parent = await Menu.findByPk(parentId);
    
    !parent && ctx.throw(404, '上级节点不存在');
  }

  const menu = await Menu.create(ctx.request.body);

  ctx.success(menu.id);
}

exports.delete = async (ctx) => {

  const { id } = ctx.request.body;

  const menu = await Menu.findByPk(id);

  !menu && ctx.throw(404, '菜单不存在');

  const ids = await findChildren(id);

  ids.unshift(id);

  // 移除该菜单和其所有子菜单
  await Menu.destroy({ where: { id: ids } });

  ctx.success();
}

async function findChildren(id, initialValue = []) {

  const ids = (
    await Menu.findAll({ where: { parentId: id } })
  ).map(child => child.id);

  const hasChildren = ids.length !== 0;

  if (hasChildren) {
    initialValue.push(...ids);

    const promise = ids.map(id => findChildren(id, initialValue));

    await Promise.all(promise);
  }

  return initialValue;
}


exports.update = async (ctx) => {

  ctx.verifyParams(menuValidator);

  const { id, parentId } = await ctx.request.body;

  const menu = await Menu.findByPk(id);

  !menu && ctx.throw(404, '菜单不存在');

  if (parentId) {
    const parent = await Menu.findByPk(parentId);
    
    !parent && ctx.throw(404, '上级节点不存在');
  }

  await Menu.update(ctx.request.body, { where: { id: id } });

  ctx.success();
}

exports.info = async (ctx) => {

  const { id } = ctx.query;

  const menu = await Menu.findByPk(id);

  !menu && ctx.throw(404, '菜单不存在');

  ctx.success(menu);
}

exports.list = async (ctx) => {
  const menus = await Menu.findAll();

  ctx.success(menus);
}

exports.page = async (ctx) => {

  const { page, size, keywords } = ctx.request.body;

  const res = await ctx.paginate(Menu, {
    page: page,
    size: size,
    keywords: keywords,
    likeField: ['name']
  });

  ctx.success(res);
}