// Node 没有解析 cooke 缓存请求体 解析复杂查询字符串之类的高层 web 程序概念的核心模块，但是 connect 提供了实现这些功能的中间件。

// cookieParser() 解析来自浏览器的 cookie，放到 req.cookies 中
// bodyParser() 读取并解析请求体，放到 req.body 中
// limit() 跟 bodyParser 联手防止读取过大的请求
// query()  解析请求 URL 的查询字符串，放到 req.query 中

// cookieParser(): 解析 HTTP cookie

var connect = require('connect');
var cookieParser = require('cookie-parser');

var app = connect()
  .use(cookieParser('tobi is a cool ferret'))
  .use(function(req, res) {
    console.log(req.cookies);
    console.log(req.signCookies);
    res.setHeader('Set-Cookie', 'foo=bar; tobi=ferret; Expires=Tue, 08 Jun 2021 10:18:14 GMT');
    res.end('hello\n');
  }).listen(3000);

  console.log('Server is running at http://127.0.0.1:3000');