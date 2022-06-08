const { User } = require("../model");

exports.add = async (ctx) => {
  const res = await User.create(ctx.request.body);

  ctx.success(res);
}

exports.delete = async (ctx) => {
  ctx.body = 'delete user';
}

exports.update = async (ctx) => {
  
}

exports.info = async (ctx) => {
  const { id } = ctx.query;

  const res = await User.findByPk(id, { 
    attributes: { exclude: 'password' } 
  });

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
  
}