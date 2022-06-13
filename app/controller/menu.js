const { Menu } = require("../model");
const { menuValidator } = require('../validator');

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

  const res = await Menu.findByPk(id);

  if (!res) ctx.throw(404, '菜单不存在');

  // 移除其关联的子菜单
  await Menu.destroy({ where: { parentId: id } });

  await Menu.destroy({ where: { id: id } });

  ctx.success();
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