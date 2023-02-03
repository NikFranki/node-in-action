var net = require('net');

net.createServer(function(socket) {
  // socket.write('Hello World!\r\n');
  // socket.end();

  console.log('socket connected!');

  socket.on('data', function(data) { // data 事件可能会出现多次
    console.log('"data" event', data);
  });

  socket.on('end', function() { // end 事件在每个 socket 上只会出现一次
    console.log('"end" event');
  });

  socket.on('close', function() { // close 事件在每个 socket 上只会出现一次
    console.log('"close" event');
  });

  socket.on('error', function(e) { // 设定错误处理器以防止出现未捕获的异常
    console.log('"error" event', e);
  });

  socket.pipe(socket);
}).listen(1377);
console.log('Server is running at http://127.0.0.1:1377');