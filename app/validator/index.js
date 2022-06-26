exports.userValidator = {
  username: 'string',
  password: { type: 'password', required: false },
  email: { type: 'email', required: false },
  nickname: { type: 'string', required: false },
  name: { type: 'string', required: false },
  desc: { type: 'string', required: false },
  avatar: { type: 'string', required: false },
  roleIdList: 'array'
};

exports.roleValidator = {
  name: 'string',
  label: { type: 'string', required: false },
  remark: { type: 'string', required: false },
  menuIdList: 'array'
};

exports.menuValidator = {
  name: 'string',
  type: 'number',
  path: { type: 'string', required: false },
  viewPath: { type: 'string', required: false },
  perm: { type: 'string', required: false },
  icon: { type: 'string', required: false },
  keepAlive: { type: 'boolean', required: false },
  isShow: { type: 'boolean', required: false },
  sort: { type: 'boolean', required: false }
}

exports.articleValidator = {
  title: 'string',
  content: { type: 'string', required: false },
  status: { type: 'boolean', required: false },
  // 目录id可以传null，这里不做限制（categoryId）
  tagIdList: { type: 'array', required: false },
  desc: { type: 'string', required: false },
  slug: { type: 'string', required: false}
}

exports.categoryValidator = {
  name: 'string',
  articleIdList: { type: 'array', required: false }
}

exports.tagValidator = {
  name: 'string',
  articleIdList: { type: 'array', required: false }
}