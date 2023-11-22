const { User, Role, Menu, Article, Category, Tag } = require('../model');

const initData = async () => {
  // 初始化菜单数据
  const menus = await Menu.findAll();
  !menus.length && await Menu.bulkCreate([
    { name: '系统管理', type: 0, router: '/sys', icon: 'Tools', orderNum: 2 },
    { name: '用户列表', type: 1, router: '/sys/user', icon: 'UserFilled', viewPath: 'modules/base/views/user.vue', keepAlive: 1, orderNum: 1, parentId: 1 },
    { name: '角色列表', type: 1, router: '/sys/role', icon: 'Avatar', viewPath: 'modules/base/views/role.vue', keepAlive: 1, orderNum: 2, parentId: 1 },
    { name: '菜单列表', type: 1, router: '/sys/menu', icon: 'Menu', viewPath: 'modules/base/views/menu.vue', keepAlive: 1, orderNum: 3, parentId: 1 },

    { name: '博客管理', type: 0, router: '/blog', icon: 'DocumentCopy', orderNum: 1 },
    { name: '文档列表', type: 1, router: '/blog/document', icon: 'Tickets', viewPath: 'modules/blog/views/article.vue', keepAlive: 1, orderNum: 1, parentId: 5 },
    { name: '目录列表', type: 1, router: '/blog/category', icon: 'Coin', viewPath: 'modules/blog/views/category.vue', keepAlive: 1, orderNum: 2, parentId: 5 },
    { name: '标签列表', type: 1, router: '/blog/tag', icon: 'Connection', viewPath: 'modules/blog/views/tag.vue', keepAlive: 1, orderNum: 3, parentId: 5 },

    { name: '文件上传', type: 1, router: '/upload/list', icon: 'Document', viewPath: 'modules/upload/views/list.vue', keepAlive: 1, orderNum: 3 },
  ]);

  // 初始化角色数据
  const roles = await Role.findAll();
  if (!roles.length) {
    const initialRoles = await Role.bulkCreate([
      { name: '系统管理员', label: 'admin-sys', userId: 1 },
      { name: '开发', label: 'dev', userId: 1 }
    ]);
    await Promise.all(initialRoles.map(role => role.addMenus(
      role.name === "系统管理员" ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [1, 2, 3, 4, 9]
    )));
  }

  // 初始化用户数据
  const users = await User.findAll();
  if (!users.length) {
    const initialUsers = await User.bulkCreate([
      { username: 'bohecola', password: '123456', name: '薄荷', nickName: '薄荷', email: 'bohecola@outlook.com', avatar: "https://avatars.githubusercontent.com/u/68556445?s=400&u=f6a48c29fc37c207888b8fad75eea286033dc320&v=4" },
      { username: 'xiaoqing', password: '123456', name: '小青', nickName: '小青' },
      { username: 'xiaolv', password: '123456', name: '小绿', nickName: '小绿' },
      { username: 'xiaohei', password: '123456', name: '小黑', nickName: '小黑' },
      { username: 'xiaobai', password: '123456', name: '小白', nickName: '小白' },
    ]);
    await Promise.all(initialUsers.map(user => user.addRoles(user.id === 1 ? [1, 2] : [2])));
  }

  // 初始化文档数据
  const articles = await Article.findAll();
  if (!articles.length) {
    const initialArticles = await Article.bulkCreate([
      { title: 'test1' },
      { title: 'test2' },
      { title: 'test3' },
      { title: 'test4' },
      { title: 'test5' }
    ]);
  }

  // 初始化标签数据
  const tags = await Tag.findAll();
  if (!tags.length) {
    const initialTags = await Tag.bulkCreate([
      { name: 'vue' },
      { name: 'react' },
      { name: 'angular' }
    ]);

    await Promise.all(initialTags.map(tag => tag.addArticles([1, 2, 3])));
  }

  // 初始化目录数据
  const categories = await Category.findAll();
  if (!categories.length) {
    const initialCategories = await Category.bulkCreate([
      { name: '前端' },
      { name: '后端' }
    ]);

    await Promise.all(initialCategories.map(category => {
      if (category.id === 1) return category.addArticles([1, 2, 3]);
      if (category.id === 2) return category.addArticles([4, 5]);
    }));
  }
};

module.exports = initData;

// { name: '新增', type: 2,  perms: 'sys:user:add', parentId: 2 },
// { name: '删除', type: 2,  perms: 'sys:user:delete', parentId: 2 },
// { name: '修改', type: 2,  perms: 'sys:user:update', parentId: 2 },
// { name: '查询', type: 2,  perms: 'sys:user:page,sys:user:list,sys:user:info', parentId: 2 },
// { name: '新增', type: 2,  perms: 'sys:role:add', parentId: 3 },
// { name: '删除', type: 2,  perms: 'sys:role:delete', parentId: 3 },
// { name: '修改', type: 2,  perms: 'sys:role:update', parentId: 3 },
// { name: '查询', type: 2,  perms: 'sys:role:page,sys:role:list,sys:role:info', parentId: 3 },
// { name: '新增', type: 2,  perms: 'sys:menu:add', parentId: 4 },
// { name: '删除', type: 2,  perms: 'sys:menu:delete', parentId: 4 },
// { name: '修改', type: 2,  perms: 'sys:menu:update', parentId: 4 },
// { name: '查询', type: 2,  perms: 'sys:menu:page,sys:menu:list,sys:menu:info', parentId: 4 }