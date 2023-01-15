// 提供静态文件服务

// 创建一个简单的静态服务器
// 用 pipe() 优化数据传输
// 通过设定状态码处理用户和文件系统错误

var http = require('http');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');

var root = __dirname; // 当前文件所在目录的路径

var server = http.createServer(function (req, res) {
  var url = parse(req.url);
  var path = join(root, url.pathname); // 构造绝对路径
  // var stream = fs.createReadStream(path); // 创建 fs.createStream
  // stream.on('data', function (chunk) { // 将文件写到响应中
  //   res.write(chunk);
  // });
  // stream.on('end', function () {
  //   res.end(); // 文件写完后结束响应
  // });

  // 使用 pipe 优化数据传输
  // var stream = fs.createReadStream(path);
  // stream.pipe(res); // res.end() 会在 stream.pipe() 内部调用
  // stream.on('error', function (err) { // 处理服务器错误
  //   res.statusCode = 500;
  //   res.end('Internal Server Error');
  // });

  // 使用 fs.stat() 实现先发之人的错误处理
  fs.stat(path, function (err, stat) {
    if (err) {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('Not Found');
      } else {
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    } else {
      res.setHeader('Content-Length', stat.size);
      var stream = fs.createReadStream(path);
      stream.pipe(res);
      stream.on('error', function (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
      });
    }
  });
});

server.listen(3000);
console.log('Server running at http://127.0.0.1:3000');