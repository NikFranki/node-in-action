// REPL(读取-计算-输出-循环)
// 编写一个 restful（表征状态转移） 的服务
var http = require('http');
var url = require('url');

var items = []; // 用一个常规的数组来存放数据

var server = http.createServer(function (req, res) {
  switch (req.method) { // req.method 是请求所用的 HTTP 方法
    case 'POST':
      var item = ''; // 设置字符串缓存
      req.setEncoding('utf8'); // 为进来的 data 事件设置字符编码
      req.on('data', function (chunk) {
        item += chunk; // 拼接字符串
      });
      req.on('end', function () {
        items.push(item); // 将完整的新事项压入事项数组中
        res.end('OK\n');
      });
      break;

    case 'GET':
      var body = items.map(function (item, i) {
        return i + ')' + item;
      }).join('\n') + '\n';
      res.setHeader('Content-Length', Buffer.byteLength(body));
      res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
      res.end(body);
      break;

    case 'DELETE':
      var path = url.parse(req.url).pathname;
      var i = parseInt(path.slice(1), 10);

      if (isNaN(i)) { // 检查数字是否有效
        res.statusCode = 400;
        res.end('Invalid item id');
      } else if (!items[i]) { // 检查请求的索引是否存在
        res.statusCode = 404;
        res.end('Item not found');
      } else { // 删除请求的事项
        items.splice(i, 1);
        res.end('OK\n');
      }
      break;

    default:
      break;
  }
});

server.listen(3000);
console.log('Server is running at http://127.0.0.1:3000');