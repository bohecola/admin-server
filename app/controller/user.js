const { User } = require("../model");
const { Op } = require('sequelize');
const { userValidator } = require('../validator');

exports.add = async (ctx) => {

  ctx.verifyParams(userValidator);

  const { id } = await User.create(ctx.request.body);

  ctx.success(id);
}

exports.delete = async (ctx) => {

  const { id } = ctx.request.body;

  const res = await User.findByPk(id);

  if (!res) ctx.throw(404, 'The resource for the operation does not exist');

  await User.destroy({ where: { id: id } });

  ctx.success();
}

exports.update = async (ctx) => {

  const { id } = await ctx.request.body;

  const res = await User.findByPk(id);

  if (!res) ctx.throw(404, 'The resource for the operation does not exist');

  ctx.verifyParams(userValidator);

  const { password } = ctx.request.body;

  password && res.passwordV++;
  
  Object.assign(res, ctx.request.body);

  await res.save();

  ctx.success();
}

exports.info = async (ctx) => {

  const { id } = ctx.query;

  const res = await User.findByPk(id, { attributes: { exclude: 'password' } });

  if (!res) ctx.throw(404, 'The resource for the operation does not exist');

  ctx.success(res);
}

exports.list = async (ctx) => {
  const res = await User.findAll({ attributes: { exclude: 'password' } });

  ctx.success(res);
}

exports.page = async (ctx) => {
  const { currentPage, pageSize, keywords } = ctx.query;

  const res = await ctx.paginate(User, {
    currentPage: currentPage,
    pageSize: pageSize,
    keywords: keywords,
    likeField: ['username', 'name'],
    exclude: ['password']
  });

  ctx.success(res);
}