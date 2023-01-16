var connect = require('connect');

function logger(req, res, next) {
  console.log('%s %s', req.method, req.url);
  next(); // 总是先调用 next()，所以后续中间件都会被调用
}

function hello(req, res) { // 不会调用 next()，因为组件响应了请求
  res.setHeader('Content-Type', 'text/plain');
  res.end('hello world');
}

// 中间件的顺序很重要，顺序不对的话，可能对于调用产生不可逆的影响
// connect()
//   .use(logger)
//   .use(hello)
//   .listen(3000);

// 这样的调用顺序，hello 之后的中间件都不会被触发
// connect()
//   .use(hello)
//   .use(logger)
//   .listen(3000);

// 模拟 HTTP basic 认证的中间件代码
function restrict(req, res, next) {
  var authorization = req.headers.authorization;
  if (!authorization) return next(new Error('Unauthorized'));

  var paths = authorization.split(' ');
  var scheme = path[0];
  var auth = new Buffer(parts[1], 'base64').toString().split(':');
  var user = auth[0];
  var pass = auth[1];

  // 模拟检查校验信息
  setTimeout(function() {
    console.log(paths, scheme, auth, user, pass);
    next();
  }, 1000);
}

connect()
  .use(logger)
  .use(restrict)
  .use(hello)
  .listen(3000);

console.log('Server is running at http://127.0.0.1:3000');