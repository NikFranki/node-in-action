// 内存存储读取和写入的速度都很快，理想用途是存放少量经常用的数据。

// 统计服务器的访问次数
var http = require('http');

var count = 0;

var server = http.createServer(function (req, res) {
  count++;
  res.write('I have been accessed ' + count + ' times.');
  res.end();
}).listen(8888);

console.log('Server is running at http://127.0.0.1:8888')