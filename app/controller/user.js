const { User } = require("../model");
const { userValidator } = require('../validator');

exports.add = async (ctx) => {

  const { roleIdList } = ctx.request.body;

  ctx.verifyParams(userValidator);

  const user = await User.create(ctx.request.body);

  roleIdList && await user.addRoles(roleIdList);

  ctx.success(user.id);
}

exports.delete = async (ctx) => {

  const { id } = ctx.request.body;

  const user = await User.findByPk(id);

  if (!user) ctx.throw(404, 'The resource for the operation does not exist');

  await User.destroy({ where: { id: id } });

  ctx.success();
}

exports.update = async (ctx) => {

  const { id, password, roleIdList } = await ctx.request.body;

  const user = await User.findByPk(id);

  if (!user) ctx.throw(404, 'The resource for the operation does not exist');

  ctx.verifyParams(userValidator);

  if (password) {
    ctx.request.body.passwordV = user.passwordV + 1;
  }

  await User.update(ctx.request.body, { where: { id: id } });

  roleIdList && await user.setRoles(roleIdList);

  ctx.success();
}

exports.info = async (ctx) => {

  const { id } = ctx.query;

  const user = await User.findByPk(
    id, { 
    attributes: { exclude: 'password' },
    include: { 
      association: 'roles',
      attributes: ['id'],
      through: { attributes: [] }
    }
  });

  if (!user) ctx.throw(404, 'The resource for the operation does not exist');

  user.setDataValue('roleIdList', user.roles.map(role => role.id))

  delete user.dataValues.roles;

  ctx.success(user);
}

exports.list = async (ctx) => {
  const res = await User.findAll({
    attributes: { exclude: 'password' },
    include: {
      association: 'roles',
      attributes: ['name'],
      through: { attributes: [] }
    }
  });

  res.forEach(user => {
    user.dataValues.roleName = user.roles.map(role => role.name).join(',')
    delete user.dataValues.roles;
  });
  ctx.success(res);
}

exports.page = async (ctx) => {
  const { currentPage, pageSize, keywords } = ctx.query;

  const res = await ctx.paginate(User, {
    currentPage: currentPage,
    pageSize: pageSize,
    keywords: keywords,
    likeField: ['username', 'name'],
    exclude: ['password'],
    association: 'roles',
    associationAttr: ['name']
  });

  res.list.forEach(user => {
    user.dataValues.roleName = user.roles.map(role => role.name).join(',')
    delete user.dataValues.roles;
  });

  ctx.success(res);
}