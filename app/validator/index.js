exports.userValidator = {
  username: 'string',
  password: { type: 'password', required: false },
  email: { type: 'email', required: false },
  name: { type: 'string', required: false },
  desc: { type: 'string', required: false },
  avatar: { type: 'string', required: false },
  roleIdList: 'array'
};

exports.roleValidator = {
  name: 'string',
  label: { type: 'string', required: false },
  remark: { type: 'string', required: false }
};