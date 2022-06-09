const { User } = require("../model");

exports.add = async (ctx) => {

  ctx.verifyParams({
    username: 'string',
    password: 'password',
    email: { type: 'email', required: false }
  });

  const res = await User.create(ctx.request.body);

  ctx.success(res);
}

exports.delete = async (ctx) => {

  ctx.verifyParams({ id: 'int' });

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

  await User.update(ctx.request.body, { where: { id: id } });

  ctx.success();
}

exports.info = async (ctx) => {

  const { id } = ctx.query;

  const res = await User.findByPk(id, { attributes: { exclude: 'password' } });

  if (!res) ctx.throw(404, 'The resource for the operation does not exist');

  ctx.success({
    ...res.toJSON(),
    passwordV: 1
  });
}

exports.list = async (ctx) => {
  const res = await User.findAll();

  ctx.success(res);
}

exports.page = async (ctx) => {
  const { currentPage = 1, pageSize = 10 } = ctx.request.body;

  const res = await User.findAll({ offset: (currentPage - 1) * pageSize, limit: pageSize });

  ctx.success(res);
}