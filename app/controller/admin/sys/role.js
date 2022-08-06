const { Op } = require('sequelize');
const { Role } = require("../../../model");
const { roleValidator } = require('../../../validator');

exports.add = async (ctx) => {

  ctx.verifyParams(roleValidator);

  const { menuIdList } = ctx.request.body;

  const role = await Role.create(ctx.request.body);

  await role.addMenus(menuIdList);

  ctx.success(role.id);
}

exports.delete = async (ctx) => {

  const { ids } = ctx.request.body;

  const res = await Role.destroy({ where: { id: ids } });

  !res && ctx.throw(404, '角色不存在');

  ctx.success();
}

exports.update = async (ctx) => {

  ctx.verifyParams(roleValidator);

  const { id, menuIdList } = ctx.request.body;

  const role = await Role.findByPk(id);

  !role && ctx.throw(404, '角色不存在');

  await Role.update(ctx.request.body, { where: { id: id } });

  await role.setMenus(menuIdList);

  ctx.success();
}

exports.info = async (ctx) => {

  const { id } = ctx.query;

  const role = await Role.findByPk(id, {
    include: {
      association: 'menus',
      attributes: ['id'],
      through: { attributes: [] }
    }
  });

  !role && ctx.throw(404, '角色不存在');

  role.setDataValue('menuIdList', role.menus.map(menu => menu.id));

  delete role.dataValues.menus;

  ctx.success(role);
}

exports.list = async (ctx) => {

  const { keyWord } = ctx.request.body;

  const roles = await Role.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.like]: `%${keyWord || ''}%` } },
        { label: { [Op.like]: `%${keyWord || ''}%` } }
      ]
    },
    order: [['createdAt', 'DESC']]
  });

  ctx.success(roles);
}

exports.page = async (ctx) => {

  const res = await ctx.paginate(Role, {
    likeField: ['name', 'label']
  });

  ctx.success(res);
}