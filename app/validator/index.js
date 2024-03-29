exports.userValidator = {
  username: 'string'
};

exports.roleValidator = {
  name: 'string',
  label: { type: 'string', required: false },
  menuIdList: 'array'
};

exports.menuValidator = {
  name: 'string',
  type: 'number',
  path: { type: 'string', required: false },
  perm: { type: 'string', required: false },
  keepAlive: { type: 'boolean', required: false },
  isShow: { type: 'boolean', required: false },
  sort: { type: 'boolean', required: false }
}

exports.articleValidator = {
  title: 'string',
  status: { type: 'boolean', required: false },
  // 目录id可以传null，这里不做限制（categoryId）
  tagIdList: { type: 'array', required: false }
}

exports.categoryValidator = {
  name: 'string',
  articleIdList: { type: 'array', required: false }
}

exports.tagValidator = {
  name: 'string',
  articleIdList: { type: 'array', required: false }
}