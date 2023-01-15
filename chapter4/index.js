var http = require('http');

// 一个简单的 http 响应服务器
// var server = http.createServer(function (req, res) {
//   res.end('Hello World!');
// });

// server.listen(3000);

// 设置响应头，并重定向到一个网站
var server = http.createServer(function (req, res) {
  var url = 'https://google.com';
  var body = '<p>Redirecting to <a href="' + url + '">' + url + '</a></p>';

  res.setHeader('Location', url);
  res.setHeader('Content-Length', body.length);
  res.setHeader('Content-Type', 'text/html');
  res.statusCode = 302;
  res.end(body);
});

server.listen(3000);

console.log('Server is running at http://127.0.0.1:3000/');