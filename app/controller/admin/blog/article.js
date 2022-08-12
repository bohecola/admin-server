const { Op } = require('sequelize');
const { Article, Tag } = require('../../../model');
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

  const { categoryId, tagIdList, status } = ctx.request.body;

  // WHERE查询条件
  const filter = {
    categoryId: categoryId,
    status: status
  };

  // 查询具有相关标签 id 的文档
  if (tagIdList && tagIdList.length) {
    // 找到所有标签
    const tags = await Tag.findAll({ where: { id: tagIdList } });
    // 每个标签对应的文章集合
    const allTagArticles = await Promise.all(tags.map((tag) => tag.getArticles()))
    
    // 每个标签对应的文章id集合 二维数组
    const allTagArticlesIds = allTagArticles.reduce((prev, articles) => {
      prev.push(articles.map((article) => article.id));
      return prev;
    }, []);

    // 得到这些标签对应的文章集合的交集，即同时包含这些标签的文章集合
    const ids = allTagArticlesIds.reduce((prev, articleIds, index) => {
      if (index === 0) {
        // 第一个文章id集合赋值给prev
        prev = articleIds;
        return prev;
      }
      // prev 和后面的集合求交集
      prev = prev.filter(id => articleIds.includes(id));
      return prev;
    }, []);

    if (ids.length) {
      Object.assign(filter, { id: ids });
    }
  }

  const res = await ctx.paginate(Article, {
    likeField: ['title'],
    excludeAttributes: ['categoryId', 'content', 'createdBy', 'updatedBy'],
    filter,
    include: [
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
    article.setDataValue('categoryName', article.category?.name || null);
    delete article.dataValues.category;

    article.setDataValue('tagNames', article.tags.map(tag => tag.name).join(',') || null);
    delete article.dataValues.tags;
  });

  ctx.success(res);
}