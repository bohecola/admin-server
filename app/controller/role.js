const { Role } = require("../model");
const { roleValidator } = require('../validator');

exports.add = async (ctx) => {

  const { menuIdList } = ctx.request.body;

  ctx.verifyParams(roleValidator);

  const role = await Role.create(ctx.request.body);

  menuIdList && await role.addRoles(menuIdList);

  ctx.success(role.id);
}

exports.delete = async (ctx) => {

  const { id } = ctx.request.body;

  const res = await Role.findByPk(id);

  if (!res) ctx.throw(404, 'The resource for the operation does not exist');

  await Role.destroy({ where: { id: id } });

  ctx.success();
}

exports.update = async (ctx) => {

  const { id } = await ctx.request.body;

  const res = await Role.findByPk(id);

  if (!res) ctx.throw(404, 'The resource for the operation does not exist');

  ctx.verifyParams(roleValidator);
  
  Object.assign(res, ctx.request.body);

  await res.save();

  ctx.success();
}

exports.info = async (ctx) => {

  const { id } = ctx.query;

  const res = await Role.findByPk(id);

  if (!res) ctx.throw(404, 'The resource for the operation does not exist');

  ctx.success(res);
}

exports.list = async (ctx) => {
  const res = await Role.findAll();

  ctx.success(res);
}

exports.page = async (ctx) => {
  const { currentPage, pageSize, keywords } = ctx.query;

  const res = await ctx.paginate(Role, {
    currentPage: currentPage,
    pageSize: pageSize,
    keywords: keywords,
    likeField: ['name', 'label']
  });

  ctx.success(res);
}