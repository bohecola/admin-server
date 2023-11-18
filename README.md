# Koa2 管理系统服务端

Koa2 + Mysql + Sequelize 搭建的博客后台管理系统

## 环境要求

- node >= 16.x
- mysql >= 8.x

## 运行

### 安装依赖

```sh
# 开发环境下 node 应用自重启工具
yarn global add nodemon
```

```sh
yarn install
```

### 启动

```sh
yarn dev
```

**默认管理员账户密码**

```
username: bohecola
password: 123456
```

> 提示：创建好名为 `admin-server` 的数据库后，启动时会自动导入数据库，无需手动导入

## 数据库配置

```js
const db = {
  database: 'admin-server',
  username: 'root',
  password: '123456',
  host: 'localhost',
  port: 3306,
  timezone: '+08:00',
  charset: 'utf8mb4'
};

module.exports = db;
```

## 服务端功能

- [x] 图片验证码登陆
- [x] JWT 接口鉴权
- [x] 用户管理
- [x] 角色管理
- [x] 菜单管理
- [x] 博客文章管理
- [x] 博客标签管理
- [x] 博客目录管理
- [x] 文件上传

## 中间键使用

**全局中间键**

- [@koa/cors](https://www.npmjs.com/package/@koa/cors) 跨域资源共享
- [koa-session](https://www.npmjs.com/package/koa-session) session 会话
- `responseBody（自定义）` 统一响应数据格式
- [koa-mount](https://www.npmjs.com/package/koa-mount) + [koa-static](https://www.npmjs.com/package/koa-static) 静态资源访问
- `auth（自定义）` 鉴权，配合 `jsonwebtoken` 实现
- [koa-bodyparser](https://www.npmjs.com/package/koa-bodyparser) 请求体解析
- [koa-parameter](https://www.npmjs.com/package/koa-parameter) 请求参数校验
- `pagination（自定义）` 分页
- [@koa/router](https://www.npmjs.com/package/@koa/router) 路由

**局部中间键**

- [@koa/multer](https://www.npmjs.com/package/@koa/multer) 文件上传

## 部署

> 生产环境为 `https` 服务，需要替换对应的证书文件

```sh
npm install pm2 -g

pm2 start <项目根目录下的pm2.json文件>
```