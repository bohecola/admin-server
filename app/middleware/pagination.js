const { Op } = require('sequelize');

const pagination = (defaultOptions) => {

  defaultOptions = {
    currentPage: 1,
    pageSize: 10
  };

  return async (ctx, next) => {
    ctx.paginate = async (Model, options = {}) => {
      const { 
        currentPage = defaultOptions.currentPage,
        pageSize = defaultOptions.pageSize,
        keywords = '',
        likeField = [],
        exclude = [],
        filter = {}
      } = options;

      const query = {
        offset: (currentPage - 1) * pageSize,
        limit: ~~pageSize,
      };

      if (exclude.length) {
        const obj = {
          attributes: { exclude: exclude }
        };
        Object.assign(query, obj);
      }

      if (keywords && likeField.length) {
        const obj = {
          where: {
            [Op.or]: likeField.map(field => ({[field]: {[Op.like]: `%${keywords}%`}})),
            ...filter
          }
        };

        Object.assign(query, obj);
      }

      const { count, rows } = await Model.findAndCountAll(query);

      const data = {
        list: rows,
        pagination: {
          page: currentPage,
          size: pageSize,
          total: count
        }
      }

      return data;
    }
    await next();
  }
};

module.exports = pagination;