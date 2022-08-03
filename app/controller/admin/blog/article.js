const { Op } = require('sequelize');
const Article = require('../../../model/blog/article');
const { articleValidator } = require('../../../validator');

exports.add = async (ctx) => {

  ctx.verifyParams(articleValidator);

  const { tagIdList } = ctx.request.body;

  const article = await Article.create(ctx.request.body);

  tagIdList && await article.addTags(tagIdList);

  ctx.success(article.id);
}

exports.delete = async (ctx) => {

  const { ids } = ctx.request.body;

  const res = await Article.destroy({ where: { id: ids } });

  !res && ctx.throw(404, '文章不存在');

  ctx.success();
}

exports.update = async (ctx) => {

  ctx.verifyParams(articleValidator);

  const { id, tagIdList } = ctx.request.body;

  const article = await Article.findByPk(id);

  !article && ctx.throw(404, '文章不存在');

  await Article.update(ctx.request.body, { where: { id: id } });

  tagIdList && await article.setTags(tagIdList);

  ctx.success();
}

exports.info = async (ctx) => {
  
  const { id } = ctx.query;

  const article = await Article.findByPk(id, {
    include: [
      {
        association: 'tags',
        attributes: ['id', 'name'],
        through: { attributes: [] }
      }
    ]
  });

  !article && ctx.throw(404, '文章不存在');

  article.setDataValue('tagIdList', article.tags.map(tag => tag.id));

  delete article.dataValues.tags;

  ctx.success(article);
}

exports.list = async (ctx) => {

  const { keyWord } = ctx.request.body;

  const articles = await Article.findAll({
    where: {
      title: { [Op.like]: `%${keyWord || ''}%` }
    },
    order: [['createdAt', 'DESC']]
  });

  ctx.success(articles);
}

exports.page = async (ctx) => {

  const { page, size, keyWord } = ctx.request.body;

  const res = await ctx.paginate(Article, {
    page: page,
    size: size,
    keyWord: keyWord,
    likeField: ['name'],
    exclude: ['categoryId'],
    associations: [
      {
        association: 'category',
        attributes: ['name']
      },
      {
        association: 'tags',
        attributes: ['name'],
        through: { attributes: [] }
      }
    ]
  });

  res.list.forEach(article => {
    article.setDataValue('categoryName', article.dataValues.category.name);
    delete article.dataValues.category;

    article.setDataValue('tagNames', article.dataValues.tags.map(tag => tag.name).join(','));
    delete article.dataValues.tags;
  });

  ctx.success(res);
}