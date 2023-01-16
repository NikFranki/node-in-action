var parse = require('url').parse;

module.exports = function route(obj) {
  return function (req, res, next) {
    if (!obj[req.method]) { // 确保 req.method 定义了
      next();
      return;
    }

    var routes = obj[req.method]; // 查找 req.method 对应的路径
    var url = parse(req.url); // 解析 URL 以便跟 pathname 匹配
    var paths = Object.keys(routes); // 将 req.method 对应的路径存放到数组中

    for (var i = 0; i < paths.length; i++) {
      var path = paths[i];
      var fn = routes[path];
      path = path.replace(/\//g, '\\/').replace(/:(\w+)/g, '([^\\/]+)');
      var re = new RegExp('^' + path + '$'); // 构建正则表达式
      var captures = url.pathname.match(re);
      if (captures) { // 尝试跟 pathname 匹配
        var args = [req, res].concat(captures.slice(1)); // 传递被匹配的分组
        fn.apply(null, args);
        return; // 当有匹配的函数时，返回，以防止后续的 next() 调用s
      }
    }
    next();
  };
}