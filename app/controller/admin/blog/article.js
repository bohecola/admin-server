const { Op } = require('sequelize');
const Article = require('../../../model/blog/article');
const { articleValidator } = require('../../../validator');

exports.add = async (ctx) => {

  ctx.verifyParams(articleValidator);

  const { categoryId, tagIdList } = ctx.request.body;

  const article = await Article.create(ctx.request.body);

  await article.addCategory(categoryId);

  await article.addTags(tagIdList);

  ctx.success(article.id);
}

exports.delete = async (ctx) => {

  const { id } = ctx.request.body;

  const res = await Article.destroy({ where: { id: id } });

  !res && ctx.throw(404, '文章不存在');

  ctx.success();
}

exports.update = async (ctx) => {

  ctx.verifyParams(articleValidator);

  const { id, categoryId, tagIdList } = ctx.request.body;

  const article = await Article.findByPk(id);

  !article && ctx.throw(404, '文章不存在');

  await Article.update(ctx.request.body, { where: { id: id } });

  await article.setCategory(categoryId);

  await article.setTags(tagIdList);

  ctx.success();
}

exports.info = async (ctx) => {
  
  const { id } = ctx.query;

  const article = await Article.findByPk(id, {
    include: [{
        association: 'categories',
        attributes: ['id', 'name']
      },{
        association: 'tags',
        attributes: ['id', 'name'],
        through: { attributes: [] }
    }]
  });

  !article && ctx.throw(404, '文章不存在');

  ctx.success(article);
}

exports.list = async (ctx) => {

  const { keywords } = ctx.query;

  const articles = await Article.findAll({
    where: {
      name: { [Op.like]: `%${keywords}%` }
    },
    order: [['createdAt', 'DESC']]
  });

  ctx.success(articles);
}

exports.page = async (ctx) => {

  const { currentPage, pageSize, keywords } = ctx.query;

  const res = await ctx.paginate(Article, {
    currentPage: currentPage,
    pageSize: pageSize,
    keywords: keywords,
    likeField: ['name']
  });

  ctx.success(res);
}