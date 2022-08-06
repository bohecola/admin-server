const { Op } = require('sequelize');
const Category = require('../../../model/blog/category');
const { categoryValidator } = require('../../../validator');

exports.add = async (ctx) => {

  ctx.verifyParams(categoryValidator);

  const { articleIdList } = ctx.request.body;

  const category = await Category.create(ctx.request.body);

  articleIdList && await category.addArticles(articleIdList);

  ctx.success(category.id);
}

exports.delete = async (ctx) => {

  const { ids } = ctx.request.body;

  const res = await Category.destroy({ where: { id: ids } });

  !res && ctx.throw(404, '目录不存在');

  ctx.success();
}

exports.update = async (ctx) => {

  ctx.verifyParams(categoryValidator);

  const { id, articleIdList } = ctx.request.body;

  const category = await Category.findByPk(id);

  !category && ctx.throw(404, '目录不存在');

  await Category.update(ctx.request.body, { where: { id: id } });

  articleIdList && await category.setArticles(articleIdList);

  ctx.success();
}

exports.info = async (ctx) => {
  
  const { id } = ctx.query;

  const category = await Category.findByPk(id, {
    include: {
      association: 'articles',
      attributes: ['id', 'title']
    }
  });

  !category && ctx.throw(404, '目录不存在');

  ctx.success(category);
}

exports.list = async (ctx) => {

  const { keyWord } = ctx.request.body;

  const categories = await Category.findAll({
    where: {
      name: { [Op.like]: `%${keyWord || ''}%` }
    },
    order: [['createdAt', 'DESC']]
  });

  ctx.success(categories);
}

exports.page = async (ctx) => {

  const res = await ctx.paginate(Category, {
    likeField: ['name']
  });

  ctx.success(res);
}