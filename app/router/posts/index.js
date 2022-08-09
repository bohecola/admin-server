const Router = require('@koa/router');
const router = new Router();

const postsController = require('../../controller/posts');

router
  .prefix('/posts')
  .get('/pages', postsController.pages)
  .get('/info/:slug', postsController.info)
  .get('/tags', postsController.tags)
  .get('/categories', postsController.categories)

module.exports = router;