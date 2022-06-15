const Router = require('@koa/router');
const router = new Router();

const article = require('./article');
const category = require('./category');
const tag = require('./tag');

router
  .prefix('/blog')
  .use(article.routes())
  .use(category.routes())
  .use(tag.routes())

module.exports = router;