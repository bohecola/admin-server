const { Op } = require('sequelize');
const Tag = require('../../../model/blog/tag');
const { tagValidator } = require('../../../validator');

exports.add = async (ctx) => {

  ctx.verifyParams(tagValidator);

  const { articleIdList } = ctx.request.body;

  const tag = await Tag.create(ctx.request.body);

  articleIdList && await tag.addArticles(articleIdList);

  ctx.success(tag.id);
}

exports.delete = async (ctx) => {

  const { ids } = ctx.request.body;

  const res = await Tag.destroy({ where: { id: ids } });

  !res && ctx.throw(404, '标签不存在');

  ctx.success();
}

exports.update = async (ctx) => {

  ctx.verifyParams(tagValidator);

  const { id, articleIdList } = ctx.request.body;

  const tag = await Tag.findByPk(id);

  !tag && ctx.throw(404, '标签不存在');

  await Tag.update(ctx.request.body, { where: { id: id } });

  articleIdList && await tag.setArticles(articleIdList);

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

  const { keyWord } = ctx.request.body;

  const tags = await Tag.findAll({
    where: {
      name: { [Op.like]: `%${keyWord || ''}%` }
    },
    order: [['createdAt', 'DESC']]
  });

  ctx.success(tags);
}

exports.page = async (ctx) => {

  const res = await ctx.paginate(Tag, {
    likeField: ['name']
  });

  ctx.success(res);
}