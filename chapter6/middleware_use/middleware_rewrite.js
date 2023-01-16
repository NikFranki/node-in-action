// 基于缩略名重写请求 URL 的中间件
var parse = require('url').parse;

module.exports = function rewrite() {
  return function (req, res, next) {
    var path = parse(req.url).pathname;
    var match = path.match(/^\/blog\/posts\/(.+)/);
    if (match) { // 只针对 /blog/posts 请求执行查找
      req.url = '/blog/posts/' + 1;
      console.log(req.url);
      next();
    } else {
      next();
    }
  };
}