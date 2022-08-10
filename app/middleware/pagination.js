const { Op } = require('sequelize');

// 分页中间件函数
const pagination = () => {
  return async (ctx, next) => {
    // ctx 上挂载分页 paginate 方法
    ctx.paginate = async (Model, options = {}) => {
      const {
        // 需要模糊查询的字段
        likeField,
        // 不查询的字段
        excludeAttributes,
        // WHERE KEY: VALUE查询
        filter = {},
        // 关联查询配置
        include,
      } = options;

      // 关键词、排序属性、排序规则
      const { keyWord, prop, order }
         = Object.keys(ctx.request.body).length 
         ? ctx.request.body
         : ctx.query;

      const page = Number(ctx.request.body.page || ctx.query.page || 1);
      const size = Number(ctx.request.body.size || ctx.query.size || 10);

      const { count, rows } = await Model.findAndCountAll({
        // 忽略的属性
        attributes: { 
          exclude: excludeAttributes || [] 
        },
        // 关联配置
        include: include || [],
        // 偏移量
        offset: (page - 1) * size,
        // 限制数量
        limit: size,
        // 排序规则
        order: [[prop || "createdAt", order?.toUpperCase() || "DESC"]],
        // 去除重复计算
        distinct: true,
        // WHERE子句
        where: {
          // 模糊查询
          [Op.or]: (likeField || []).map(field => ({[field]: {[Op.like]: `%${keyWord || ''}%`}})),
          // KEY: VUELE查询
          ...(
            Object.fromEntries(
              Object.entries(filter)
                .filter(([_, v]) => {
                  // 不查询值为 null、"" 的属性
                  return v != null && v !== "";
                }))
            )
        }
      });

      return {
        list: rows,
        pagination: {
          page: page,
          size: size,
          total: count
        }
      };
    }
    await next();
  }
};

module.exports = pagination;