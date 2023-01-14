// 用 on 方法响应事件-echo 服务器
var net = require('net');

var server = net.createServer(function (socket) {
  // socket.on('data', function (data) { // 当读取到新数据时处理的 data 事件
  //   socket.write(data); // 数据被写回客户端
  // });

  socket.once('data', function (data) { // data 事件只被处理一次
    socket.write(data);
  });
});

server.listen(8888);
console.log('Server is running at http://127.0.0.1:8888');