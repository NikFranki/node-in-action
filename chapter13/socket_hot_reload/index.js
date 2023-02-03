var fs = require('fs');
var url = require('url');
var http = require('http');
var path = require('path');
var express = require('express');
var app = express();
var server = http.createServer(app); // 包装 http 服务器创建 Socket.IO 实例
var io = require('socket.io').listen(server);
var root = __dirname;

app.use(function(req, res, next) { // 用中间件开始检测由 static 中间件返回的文件
  req.on('static', function() { // 注册由 static() 中间件发射的 static 事件
    var file = url.parse(req.url).pathname;
    var mode = 'stylesheet';
    if (file[file.length - 1] === '/') {
      file += 'index.html';
      mode = 'reload';
    }
    createWatcher(file, mode); // 确定要提供的文件名并调用 createWatcher()
  });
  next();
});

app.use(express.static(root)); // 将服务器设置为基本的静态文件服务器

var watchers = {}; // 保存被检测的活动文件

function createWatcher(file, event) {
  var absolute = path.join(root, file);

  if (watchers[absolute]) {
    return;
  }

  fs.watchFile(absolute, function(curr, prev) { // 开始检测文件发生的所有变化
    if (curr.mtime !== prev.mtime) {
      io.sockets.emit(event, file);
    }
  });

  watchers[absolute] = true; // 将文件记为检测对象
}

server.listen(8000);
console.log('Server is running at http://127.0.0.1:8000');