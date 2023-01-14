// 用事件发射器实现简单的发布订阅系统

var events = require('events');
var net = require('net');
var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

// 增加事件发射器上的监听器数量
// chennel.setMaxListeners(50);

// 添加 join 事件的监听器，保存用户的 client 对象，以便程序可以将数据发送给用户
channel.on('join', function (id, client) {
  var welcome = 'Welcome!\n' + 'Guests online: ' + this.listeners('broadcast').length;
  client.write(welcome + '\n');
  this.clients[id] = client;
  this.subscriptions[id] = function (senderId, message) {
    if (senderId !== id) { // 忽略这一广播的用户
      this.clients[id].write(message);
    }
  };
  this.on('broadcast', this.subscriptions[id]); // 添加一个专门针对当前用户的 broadcast 事件监听器
});

// 创建 leave 事件监听器
channel.on('leave', function (id) {
  channel.removeListener('broadcast', this.subscriptions[id]); // 移除指定客户端的 broadcast 监听器
  channel.emit('broadcast', id, id + ' has left this chat.\n');
});

// 处于某种原因，想要停止提供聊天服务，但是又不想要关闭服务器，那么这个时候可以用 removeAllListeners 事件发射器去掉指定类型的全部监听器
channel.on('shutdown', function () {
  channel.emit('broadcast', '', 'Chat has shut down.\n');
  channel.removeAllListeners('broadcast');
});

var server = net.createServer(function (client) {
  var id = client.remoteAddress + ':' + client.remotePort;
  channel.emit('join', id, client); // 当有用户连到服务器上来时发出一个 join 事件，指明用户的 ID 和 client 对象
  client.on('data', function (data) {
    data = data.toString();
    // 查看是否关闭聊天服务
    if (data === 'shutdown\r\n') {
      channel.emit('shutdown');
    }
    channel.emit('broadcast', id, id + ':' + data); // 当有用户发送数据时，发出一个频道的 broadcast 事件，指明用户 ID 和消息
  });
  client.on('close', function () {
    channel.emit('leave', id); // 在用户断开连接的时候发出 leave 事件
  });
});

server.listen(8888);
console.log('Server is running at http://127.0.0.1:8888');