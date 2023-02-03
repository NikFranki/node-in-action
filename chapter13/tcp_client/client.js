// eg: netcat localhost 3000

// 用 Node 实现 netcat 命令的简单复制品
var net = require('net');
var host  = process.argv[2]; // 从命令行中解析出域名
var port = +process.argv[3]; // 从命令行中解析出端口

var socket = net.connect(port, host); // 创建 socket 实例并开始连接服务器

socket.on('connect', function() { // 到服务器的连接建立好后处理 connect 事件
  process.stdin.pipe(socket); // 将进程的 stdin 传给 socket
  socket.pipe(process.stdout); // 将 socket 的数据传递给进程的 stdout
  process.stdin.resume(); // 在 stdin 上调用 resume()，开始读取数据
});

socket.on('end', function() { // 当发生 event 事件时中断 stdin
  process.stdin.pause();
});