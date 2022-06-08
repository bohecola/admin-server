const responseObject = {
  // 默认请求成功
  DEFAULT_SUCCESS: {
    code: 1000,
    msg: ''
  },
  // 默认请求失败
  DEFAULT_ERROR: {
    code: 1001,
    msg: '系统错误'
  },
  LACK: {
    code: 199,
    msg: '缺少必要参数'
  },
  TOKEN_ERROR: {
    code: 401,
    msg: 'Token验证失败'
  },
  LOGIN_ERROR: {
    code: 1001,
    msg: '用户名或密码错误'
  }
}
module.exports = responseObject;