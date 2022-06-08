exports.add = async (ctx) => {
  ctx.body = 'add user';
}

exports.delete = async (ctx, next) => {
  ctx.body = 'delete user';
  next();
}

exports.update = async (ctx, next) => {
  
}

exports.info = async (ctx, next) => {
  
}

exports.list = async (ctx, next) => {
  
}

exports.page = async (ctx, next) => {
  
}