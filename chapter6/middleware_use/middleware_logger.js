function setup(format) {
  var regexp = /:(\w+)/g; // logger 组件用正则表达式匹配请求属性

  return function (req, res, next) { // connect 使用的真正 logger 组件
    var str = format.replace(regexp, function (mathch, property) { // 用正则表达式格式化请求的日志条目
      return req[property];
    });
    console.log(str); // 将日志输出到控制台
    next(); // 将控制权交由下一个中间件
  };
}

module.exports = setup;