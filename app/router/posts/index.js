const Router = require('@koa/router');
const router = new Router();

const postsController = require('../../controller/posts');

router
  .prefix('/posts')
  .post('/page', postsController.page)
  .get('/info', postsController.info)
  .get('/tags', postsController.tags)
  .get('/categories', postsController.categories)
  .get('/records', postsController.records)
  .get('/profile', postsController.profile);

module.exports = router;