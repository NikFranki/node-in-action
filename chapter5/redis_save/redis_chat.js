// 使用 redis 的发布订阅功能实现简单聊天服务器

var net = require('net');
var redis = require('redis');

var server = net.createServer(function (socket) { // 为每个连接到聊天服务器上的用户设置逻辑
  var subscriber;
  var publisher;

  socket.on('connect', function () {
    subscriber = redis.createClient(); // 为用户创建订阅客户端
    subscriber.subscribe('main_chat_room'); // 订阅信道

    subscriber.on('message', function (channel, message) { // 信道收到信息后把它发送给用户
      socket.write('Channel ' + channel + ': ' + message);
    });

    publisher = redis.createClient(); // 为用户创建发布客户端
  });

  socket.on('data', function (data) {
    publisher.publish('main_chat_room', data); // 用户输入信息后发布它
  });

  socket.on('end', function () {
    subscriber.unsubscribe('mian_chat_room'); // 如果用户断开连接，终止客户端连接
    subscriber.end();
    publisher.end();
  });
});

server.listen(3000);
console.log('Redis Server is running at http://1227.0.0.1:6379')