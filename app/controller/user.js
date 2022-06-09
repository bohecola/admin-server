const { User } = require("../model");
const { Op } = require('sequelize');

exports.add = async (ctx) => {

  ctx.verifyParams({
    username: 'string',
    password: 'password',
    email: { type: 'email', required: false },
    name: { type: 'string', required: false },
    desc: { type: 'string', required: false },
    avatar: { type: 'string', required: false },
  });

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

  ctx.verifyParams({
    username: 'string',
    password: 'password',
    email: { type: 'email', required: false },
    name: { type: 'string', required: false },
    desc: { type: 'string', required: false },
    avatar: { type: 'string', required: false },
  });

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
  const { currentPage = 1, pageSize = 10, keywords = '' } = ctx.query;

  const { count, rows } = await User.findAndCountAll({
    where: {
      [Op.or]: [
        {username: {[Op.like]: `%${keywords}%`}},
        {name: {[Op.like]: `%${keywords}%`}}
      ]
    },
    attributes: { exclude: 'password' },
    offset: (currentPage - 1) * pageSize,
    limit: ~~pageSize,
  });

  ctx.success({ total: count, data: rows });
}