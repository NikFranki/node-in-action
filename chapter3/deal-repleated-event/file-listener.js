// 基于事件发射器的基础上构建程序，可以新建一个新的类继承事件发射器

// 需要三步
// 1. 创建类的构造器
// 2. 继承事件发射器的行为
// 3. 扩展这些行为

function Watcher(watchDir, processedDir) {
  this.watchDir = watchDir;
  this.processedDir = processedDir;
}

var events = require('events');
var util = require('util');

util.inherits(Watcher, events.EventEmitter);

// 扩展事件发射器的功能
var fs = require('fs');
const path = require('path');
var watchDir = './watch';
var processedDir = './done';

// 扩展 EventEmitter 添加文件处理的方法
Watcher.prototype.watch = function () {
  var watcher = this; // 保存对 Watcher 对象的引用，以便在后续的代码中使用
  const dirPath = path.resolve(__dirname, this.watchDir);
  fs.readdir(dirPath, function (err, files) {
    if (err) throw err;
    for (var index in files) {
      watcher.emit('process', files[index]); // 处理 watch 目录的所有文件
    }
  });
};

// 添加开始监控的方法
Watcher.prototype.start = function () {
  var watcher = this;
  fs.watchFile(watchDir, function () {
    watcher.watch();
  });
};

var watcher = new Watcher(watchDir, processedDir);

// 继承事件发射器的 on 方法设定文件处理逻辑
watcher.on('process', function (file) {
  var watchFile = path.resolve(__dirname, this.watchDir + '/' + file);
  var processedFile = path.resolve(__dirname, this.processedDir + '/' + file.toLowerCase());

  fs.rename(watchFile, processedFile, function (err) {
    if (err) throw err;
  });
});

watcher.start();