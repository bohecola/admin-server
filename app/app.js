const Koa = require('koa');
const static = require('koa-static');
const mount = require('koa-mount');
const path = require('path');
const router = require('./router');

const app = new Koa();

app.use(mount('/public', static(path.join(__dirname, './public'))));

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000, () => {
  console.log('http://localhost:3000');
});
