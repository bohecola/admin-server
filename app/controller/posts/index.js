const { page, info } = require('../admin/blog/article');
const { Article, Tag, Category, User } = require('../../model');
const sequelize = require('sequelize');
const _ = require('lodash');

exports.page = page;

exports.info = async (ctx) => {
  // id
  const { id } = ctx.query;
  // 查询
  const article = await Article.findByPk(id, {
    attributes: { exclude: ['categoryId', 'createdBy', 'updatedBy'] },
    include: [
      {
        association: 'category',
        attributes: ['id', 'name']
      },
      {
        association: 'tags',
        attributes: ['id', 'name'],
        through: { attributes: [] }
      }
    ]
  });

  !article && ctx.throw(404, '文章不存在');

  ctx.success(article);
}

// 标签
exports.tags = async (ctx) => {
  const tags = await Tag.findAll({
    attributes: [
      'id',
      'name',
      [sequelize.literal(`(
        SELECT COUNT(*)
        FROM articles_tags
        WHERE
        articles_tags.tagId = tag.id
        )`),
      'count']
    ],
    order: [['createdAt', 'DESC']]
  });

  ctx.success(tags);
}

exports.categories = async (ctx) => {
  // 目录
  const categories = await Category.findAll({
    attributes: [
      'id',
      'name',
      [sequelize.literal(`(
        SELECT COUNT(*)
        FROM articles
        WHERE
        articles.categoryId = category.id
        )`),
      'count']
    ],
    order: [['createdAt', 'DESC']]
  });
  ctx.success(categories);
}

exports.records = async (ctx) => {
  // 归档
  const res = await Article.findAll({
    attributes: [
      'id',
      [sequelize.fn('any_value', sequelize.col('title')), 'title'],
      [sequelize.fn('any_value', sequelize.col('desc')), 'desc'],
      [sequelize.fn('date_format', sequelize.col('createdAt'), '%Y'), 'year'],
      [sequelize.fn('date_format', sequelize.col('createdAt'), '%Y-%m-%d'), 'day'],
    ],
    group: ['day', 'id'],
  });
  // JSON
  const raw = res.map(item => item.toJSON())
  // 分组
  const records = _.groupBy(raw, 'year');
  for(const key in records) {
    records[key].forEach(post => delete post.year);
  }
  ctx.success(records);
}

exports.profile = async (ctx) => {
  // 个人资料
  const profile = await User.findByPk(1, {
    attributes: ['nickName', 'avatar', 'desc', 'email']
  });
  ctx.success(profile)
}
