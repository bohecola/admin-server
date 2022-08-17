const { Article, Tag, Category, User } = require('../../model');
const sequelize = require('sequelize');
const _ = require('lodash');

exports.page = async (ctx) => {

  const { categorySlug, tagSlugList = [] } = ctx.request.body;

  // WHERE查询条件
  const filter = {
    status: 1
  };

  if (categorySlug) {
    const category = await Category.findOne({ 
      where: { slug: categorySlug } 
    });

    filter.categoryId = category.id;
  }

  const tagIdList = [];

  if (tagSlugList && tagSlugList.length) {
    const tags = await Tag.findAll({ 
      where: { slug: tagSlugList } 
    });

    tagIdList.push(...tags.map(t => t.id))
  }

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

exports.info = async (ctx) => {
  // slug
  const { slug } = ctx.query;
  // 查询
  const article = await Article.findOne({
    where: { slug: slug },
    attributes: { exclude: ['status', 'categoryId', 'createdBy', 'updatedBy'] },
    include: [
      {
        association: 'category',
        attributes: ['id', 'name', 'slug']
      },
      {
        association: 'tags',
        attributes: ['id', 'name', 'slug'],
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
      'slug',
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
      'slug',
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
      'slug',
      'title',
      'desc',
      [sequelize.fn('date_format', sequelize.col('createdAt'), '%Y'), 'year'],
      [sequelize.fn('date_format', sequelize.col('createdAt'), '%Y-%m-%d'), 'day'],
      'createdAt'
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
