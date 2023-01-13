var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

exports.listen = function (server) {
    io = socketio.listen(server); // 启动 Socket.IO 服务器，允许它搭载已有的 HTTP 服务器上
    io.set('log level', 1);

    io.sockets.on('connection', function (socket) { // 定义每个用户连接的处理逻辑
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed); // 在用户连接上来时赋予一个访客名称
        joinRoom(socket, 'Lobby'); // 在用户连接上来时把他放入聊天室 Lobby 里面

        handleMessageBroadcasting(socket, nickNames); // 处理用户消息

        handleNameChangeAttempts(socket, nickNames, namesUsed); // 处理用户名称更改

        handleRoomJoining(socket); // 处理聊天室的创建及变更

        // 用户发出请求时，向其提供已经被占用的聊天室的列表
        socket.on('rooms', function () {
            socket.emit('rooms', io.sockets.manager.rooms);
        });

        handleClentDisconnection(socket, nickNames, namesUsed); // 处理用户断开连接
    });

    /**
     * 处理程序场景及事件
     * 
     * 分配昵称
     * 房间变更请求
     * 昵称变更请求
     * 发送聊天消息
     * 房间创建
     * 用户断开连接
     */

    /**
     * 分配昵称
     *
     */
    function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
        var name = 'Guest' + guestNumber; // 生成新昵称
        nickNames[socket.id] = name; // 把客户名称跟连接 ID 关联上
        socket.emit('nameResult', { success: true, name: name }); // 让用户知道他们的昵称
        namesUsed.push(name); // 存放已经被占用的昵称
        return guestNumber + 1; // 增加用来生成昵称的计数器
    }

    /**
     * 进入聊天室
     *
     */
    function joinRoom(socket, room) {
        socket.join(room); // 让用户进入房间
        currentRoom[socket.id] = room; // 记录用户当前的房间
        socket.emit('joinResult', { room: room }); // 让用户他们知道进入了新的房间
        socket.broadcast.to(room).emit('message', { // 让房间的其他用户知道有新用户进入了房间
            text: nickNames[socket.id] + ' has joined ' + room + '.'
        });
        var usersInRoom = io.sockets.clients(room); // 确定有哪些用户在这个房间里面
        if (usersInRoom.length > 1) { // 如果不知一个用户在这个房间里，汇总一下都有谁在里面
            var usersInRoomSummary = 'Users currently in ' + room + ': ';
            for (var index in usersInRoom) {
                var userSocketId = usersInRoom[index].id;
                if (userSocketId !== socket.id) {
                    if (index > 0) {
                        usersInRoomSummary += ', ';
                    }
                    usersInRoomSummary += nickNames[userSocketId];
                }
            }
            usersInRoomSummary += '.';
            socket.emit('message', { text: usersInRoomSummary }); // 将房间里的其他用户汇总发送给这个用户
        }
    }

    /**
     * 处理昵称变更
     *
     * @param {*} socket
     * @param {*} nickNames
     * @param {*} namesUsed
     */
    function handleNameChangeAttempts(socket, nickNames, namesUsed) {
        socket.on('nameAttempt', function (name) { // 添加 nameAttempt 事件监听器
            if (name.indexOf('Guest') === 0) { // 昵称不能以 Guest 开头
                socket.emit('nameResult', {
                    success: false,
                    message: 'Names cannot begisn with "Guest".'
                });
            } else {
                if (namesUsed.indexOf(name) === -1) { // 如果还没有注册商就注册上
                    var previousName = nickNames[socket.id];
                    const previousNameIndex = namesUsed.indexOf(previousName);
                    namesUsed.push(name);
                    nickNames[socket.id] = name;
                    delete namesUsed[previousNameIndex]; // 删掉之前用的昵称，让其他用户可以使用
                    socket.emit('nameResult', {
                        success: true,
                        name: name
                    });
                    socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                        text: previousName + ' is now known as ' + name + '.'
                    });
                } else {
                    socket.emit('nameResult', { // 如果昵称已经被占用的话，给客户端发送错误消息
                        success: false,
                        message: 'That name is already in use.'
                    });
                }
            }
        });
    }

    /**
     * 发送聊天消息
     *
     */
    function handleMessageBroadcasting(socket) {
        socket.on('message', function (message) {
            socket.broadcast.to(message.room).emit('message', {
                text: nickNames[socket.id] + ': ' + message.text
            });
        });
    }

    /**
     * 加入房间
     *
     * @param {*} socket
     */
    function handleRoomJoining(socket) {
        socket.on('join', function (room) {
            socket.leave(currentRoom[socket.id]);
            joinRoom(socket, room.newRoom);
        });
    }

    /**
     * 用户断开连接
     *
     * @param {*} socket
     */
    function handleClentDisconnection(socket) {
        socket.on('disconnect', function () {
            var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
            delete namesUsed[nameIndex];
            delete nickNames[socket.id];
        });
    }
};





























