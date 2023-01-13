// 创建一个类，用来汇集聊天过程中行为
var Chat = function (socket) {
    this.socket = socket;
}

// 发送消息
Chat.prototype.sendMessage = function (room, text) {
    var message = {
        room: room,
        text: text
    };
    this.socket.emit('message', message);
};

// 变更房间
Chat.prototype.changeRoom = function (room) {
    this.socket.emit('join', {
        newRoom: room
    });
};

// 处理聊天命令
Chat.prototype.processCommand = function (command) {
    var words = command.split(' ');
    var command = words[0].substring(1, words[0].length).toLowerCase(); // 从第一个单词开始解析命令
    var message = false;
    switch (command) {
        case 'join':
            words.shift();
            var room = words.join(' ');
            this.changeRoom(room); // 处理房间的变换
            break;
        case 'nick':
            words.shift();
            var name = words.join(' ');
            this.socket.emit('nameAttempt', name); // 处理更名
            break;

        default:
            message = 'Unrecognized command.'; // 如果命令无法被识别，返回错误消息
            break;
    }
    return message;
};

