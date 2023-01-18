// 实现分页模型

module.exports = function(fn, perpage) {
  perpage = perpage || 10; // 每页显示的条数
  return function(req, res, next) { // 设置中间件函数
    var page = Math.max(parseInt(req.param('page') || '1', 10), 1) - 1;

    fn(function(err, total) {
      if (err) return next(err);

      req.page = res.locals.page = {
        number: page, // 第几页
        perpage, // 每页显示条数
        from: page * perpage, // 起始页码
        to: page * perpage + perpage - 1, // 结束页码
        total, // 消息总数
        count: Math.ceil(total / perpage) // 消息的总页数
      };

      next();
    });
  };
};