const responseBody = (options = {}) => {
  return async (ctx, next) => {
    ctx.success = (data, type) => {
      ctx.type = type || options.type || 'json';
      ctx.body = {
        code: options.successCode || 1000,
        data,
        message: options.successMessage || 'success'
      };
    }

    ctx.fail = (message, code) => {
      ctx.type = options.type || 'json';
      ctx.body = {
        code: code || options.failCode || 1001,
        message: message || options.failMessage || 'fail'
      };
    }

    ctx.error = (error, code) => {
      ctx.type = options.type || 'json';
      ctx.body = {
        code: code || options.errorCode || 1001,
        error: error || '服务器异常'
      };
    }
    await next();
  }
};

module.exports = responseBody;