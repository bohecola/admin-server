const { Op } = require('sequelize');
const { User } = require("../../../model");
const { userValidator } = require('../../../validator');

exports.add = async (ctx) => {

  ctx.verifyParams(userValidator);

  const { roleIdList } = ctx.request.body;

  const user = await User.create(ctx.request.body);

  await user.addRoles(roleIdList);

  ctx.success(user.id);
}

exports.delete = async (ctx) => {

  const { ids } = ctx.request.body;

  const res = await User.destroy({ where: { id: ids } });

  !res && ctx.throw(404, '用户不存在');

  ctx.success();
}

exports.update = async (ctx) => {

  ctx.verifyParams(userValidator);

  const { id, password, roleIdList } = await ctx.request.body;

  const user = await User.findByPk(id);

  !user && ctx.throw(404, '用户不存在');

  if (password) {
    ctx.request.body.passwordV = user.passwordV + 1;
  }

  await User.update(ctx.request.body, { where: { id: id } });

  await user.setRoles(roleIdList);

  ctx.success();
}

exports.info = async (ctx) => {

  const { id } = ctx.query;

  const user = await User.findByPk(id, { 
    attributes: { exclude: 'password' },
    include: { 
      association: 'roles',
      attributes: ['id'],
      through: { attributes: [] }
    }
  });

  !user && ctx.throw(404, '用户不存在');

  user.setDataValue('roleIdList', user.roles.map(role => role.id))

  delete user.dataValues.roles;

  ctx.success(user);
}

exports.list = async (ctx) => {
  
  const { keyWord } = ctx.request.body;

  const users = await User.findAll({
    attributes: { exclude: 'password' },
    include: {
      association: 'roles',
      attributes: ['name'],
      through: { attributes: [] }
    },
    where: {
      [Op.or]: [
        { username: { [Op.like]: `%${keyWord || ''}%` } },
        { name: { [Op.like]: `%${keyWord || ''}%` } }
      ]
    },
    order: [['createdAt', 'DESC']]
  });

  users.forEach(user => {
    user.dataValues.roleName = user.roles.map(role => role.name).join(',')
    delete user.dataValues.roles;
  });

  ctx.success(users);
}

exports.page = async (ctx) => {

  const { page, size, keyWord } = ctx.request.body;

  const res = await ctx.paginate(User, {
    page: page,
    size: size,
    keyWord: keyWord,
    likeField: ['username', 'name'],
    exclude: ['password'],
    associations: [
      {
        association: 'roles',
        attributes: ['name'],
        through: { attributes: [] }
      }
    ]
  });

  res.list.forEach(user => {
    user.dataValues.roleName = user.roles.map(role => role.name).join(',');
    delete user.dataValues.roles;
  });

  ctx.success(res);
}