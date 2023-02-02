// 用自己的时间更新客户端的 Socket.IO 服务器

var app = require('http').createServer(handler);
var io = require('socket.io').listen(app); // 将普通的 http 服务器升级为 Socket.IO 服务器
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};
// var html = fs.readFileSync('index.html', 'utf8');

// 错误响应
function send404(response) {
  response.writeHead(404, { 'Content-Type': 'text/plain' });
  response.write('Error 404: resource not found.');
  response.end();
}

// 发送文件
function sendFile(response, filePath, fileContents) {
  response.writeHead(200, { 'Content-Type': mime.lookup(path.basename(filePath)) });
  response.end(fileContents);
}

// 提供静态文件服务
function serverStatic(response, cache, absPath) {
  if (cache[absPath]) {
    sendFile(response, absPath, cache[absPath]);
  } else {
    fs.exists(absPath, function(exists) {
      if (exists) {
        fs.readFile(absPath, function(err, data) {
          if (err) {
            send404(response);
          } else {
            cache[absPath] = data;
            sendFile(response, absPath, data);
          }
        });
      } else {
        send404(response);
      }
    });
  }
}

function handler(req, res) {
  // res.setHeader('Content-Type', 'text/html');
  // res.setHeader('Content-Length', Buffer.byteLength(html, 'utf8'));
  // res.end(html);
  var filePath = false;

  if (req.url === '/') {
    filePath = 'public/html/index.html';
  } else {
    filePath = 'public' + req.url;
  }
  var absPath = './' + filePath;
  serverStatic(res, cache, absPath);
}

function tick() {
  var now = new Date().toUTCString(); // 取得当前时间的 UTC 表示
  console.log(123, now);
  io.sockets.send(now); // 将时间发送给所有连接上来的客户端
}

setInterval(tick, 1000);

app.listen(8000);

console.log('Server is running at http://127.0.0.1:8000');