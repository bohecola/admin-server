const { Op } = require('sequelize');

const pagination = (defaultOptions) => {

  defaultOptions = {
    page: 1,
    size: 10
  };

  return async (ctx, next) => {
    ctx.paginate = async (Model, options = {}) => {
      const { 
        keyWord,
        likeField = [],
        exclude = [],
        filter = {},
        associations = [],
        order = [['createdAt', 'DESC']]
      } = options;

      const page = Number(options.page) || defaultOptions.page;
      const size = Number(options.size) || defaultOptions.size;

      const query = {
        offset: (page - 1) * size,
        limit: ~~size,
        order: order,
        distinct: true
      };

      if (exclude.length) {
        const obj = {
          attributes: { exclude: exclude }
        };
        Object.assign(query, obj);
      }

      if (likeField.length) {
        const obj = {
          where: {
            [Op.or]: likeField.map(field => ({[field]: {[Op.like]: `%${keyWord || ''}%`}})),
            ...filter
          }
        };

        Object.assign(query, obj);
      }

      if (associations.length) {
        const obj = {
          include: associations
        };

        Object.assign(query, obj);
      }

      const { count, rows } = await Model.findAndCountAll(query);

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