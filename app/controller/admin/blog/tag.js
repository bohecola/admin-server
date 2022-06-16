const { Op } = require('sequelize');
const Tag = require('../../../model/blog/tag');
const { tagValidator } = require('../../../validator');

exports.add = async (ctx) => {

  ctx.verifyParams(tagValidator);

  const { articleIdList } = ctx.request.body;

  const tag = await Tag.create(ctx.request.body);

  await tag.addArticles(articleIdList);

  ctx.success(tag.id);
}

exports.delete = async (ctx) => {

  const { id } = ctx.request.body;

  const res = await Tag.destroy({ where: { id: id } });

  !res && ctx.throw(404, '标签不存在');

  ctx.success();
}

exports.update = async (ctx) => {

  ctx.verifyParams(tagValidator);

  const { id, articleIdList } = ctx.request.body;

  const tag = await Tag.findByPk(id);

  !tag && ctx.throw(404, '标签不存在');

  await Tag.update(ctx.request.body, { where: { id: id } });

  await tag.setArticles(articleIdList);

  ctx.success();
}

exports.info = async (ctx) => {
  
  const { id } = ctx.query;

  const tag = await Tag.findByPk(id, {
    include: {
      association: 'articles',
      attributes: ['id', 'title']
    }
  });

  !tag && ctx.throw(404, '标签不存在');

  ctx.success(tag);
}

exports.list = async (ctx) => {

  const { keywords } = ctx.query;

  const tags = await Tag.findAll({
    where: {
      name: { [Op.like]: `%${keywords}%` }
    },
    order: [['createdAt', 'DESC']]
  });

  ctx.success(tags);
}

exports.page = async (ctx) => {

  const { currentPage, pageSize, keywords } = ctx.query;

  const res = await ctx.paginate(Tag, {
    currentPage: currentPage,
    pageSize: pageSize,
    keywords: keywords,
    likeField: ['name']
  });

  ctx.success(res);
}