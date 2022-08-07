const { Op } = require('sequelize');

const pagination = (defaultOptions) => {

  defaultOptions = {
    page: 1,
    size: 10
  };

  return async (ctx, next) => {

    ctx.paginate = async (Model, options = {}) => {
      const { 
        likeField = [],
        excludeAttributes = [],
        filter = {},
        associations = [],
      } = options;

      const { keyWord, prop, order } = ctx.request.body;

      const page = Number(ctx.request.body.page || options.page || defaultOptions.page);
      const size = Number(ctx.request.body.size || options.size || defaultOptions.page);

      const { count, rows } = await Model.findAndCountAll({
        // 忽略的属性
        attributes: { exclude: excludeAttributes || [] },
        // 关联配置
        include: associations || [],
        // 偏移量
        offset: (page - 1) * size,
        // 限制数量
        limit: size,
        // 排序规则
        order: [[prop || "updatedAt", order?.toUpperCase() || "DESC"]],
        // 去除重复计算
        distinct: true,
        // WHERE子句
        where: {
          // 模糊查询
          [Op.or]: likeField?.map(field => ({[field]: {[Op.like]: `%${keyWord || ''}%`}})),
          // KEY: VUELE查询
          ...(
            Object.fromEntries(
              Object.entries(filter)
                .filter(([_, v]) => {
                  return v != null && v !== "";
                }))
            )
        }
      });

      const data = {
        list: rows,
        pagination: {
          page: page,
          size: size,
          total: count
        }
      };

      return data;
    }
    await next();
  }
};

module.exports = pagination;