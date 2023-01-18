// 把数据库加载的信息保存在一个请求/响应对象中

var User = require('../user');

module.exports = function(req, res, next) {
  var uid = req.session.uid; // 从会话中取出已登录用户的 ID
  if (!uid) return next();
  
  User.get(uid, function(err, user) { // 从 Redis 取出已登录用户的数据
    if (err) return next(err);

    req.user = res.locals.user = user; // 将用户数据输出到响应对象中
    next();
  });
};