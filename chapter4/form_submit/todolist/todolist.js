// 处理表单输入

// 表单提交请求带的 Content-Type 值通常有两种：
// 1 application/x-www-form-urlencoded HTML 表单默认值
// 2 multipart/form-data 表单文件中含有非 ASCII 或 二进制数据时使用

var http = require('http');
var url = require('url');

var items = [];

var server = http.createServer(function (req, res) {
  if (Number.isInteger(parseInt(url.parse(req.url).pathname.replace(/([\/\?])/g, '')))) {
    del(req, res);
    return;
  }

  if (req.url === '/') {
    switch (req.method) {
      case 'GET':
        show(res);
        break;

      case 'POST':
        add(req, res);
        break;

      default:
        badRequest();
        break;
    }
  } else {
    notFound(res);
  }
});

server.listen(3000);
console.log('Server is running at http://127.0.0.1:3000');

// 显示页面
function show(res) {
  var html = '<!DOCTYPE html>' +
    '<html lang="en">' +
    '<head>' +
    '<title>Todo List</title>' +
    '</head>' +
    '<body>' +
    '<h1>Todo List</h1>' +
    '<ul>' +
    items.map(function (item, index) {
      return '<li>' + item +
        '<form action="/' + index + '" method="delete">' +
        '<input type="submit" value="delete" />' +
        '</form>'
        + '</li>';
    }).join('') +
    '</ul>' +
    '<form action="/" method="post">' +
    '<p><input type="text" name="item" /></p>' +
    '<p><input type="submit" value="Add Item" /></p>' +
    '</form>' +
    '</body>' +
    '</html>'

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(html));
  res.end(html);
}

function notFound(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Not Found');
}

// 处理错误请求
function badRequest(res) {
  res.statusCode = 400;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Bad Request');
}

// 处理添加
var qs = require('querystring');
function add(req, res) {
  var body = '';
  req.setEncoding('utf8');
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    var obj = qs.parse(body);
    items.push(obj.item);
    show(res);
  });
}

// 处理删除
function del(req, res) {
  var query = url.parse(req.url).query;
  var delNum = query.split('=')[1];
  items.splice(delNum, 1);
  show(res);
}