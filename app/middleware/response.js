const responseBody = (options = {}) => {
  return async (ctx, next) => {
    ctx.success = (data, type) => {
      ctx.type = type || options.type || 'json';
      ctx.body = {
        code: options.successCode || 1000,
        message: options.successMessage || 'success',
        data
      };
    }

    ctx.fail = (message, code) => {
      ctx.type = options.type || 'json';
      ctx.body = {
        code: code || options.failCode || 1001,
        message: message || options.failMessage || 'fail'
      };
    }
    await next();
  }
};

module.exports = responseBody;