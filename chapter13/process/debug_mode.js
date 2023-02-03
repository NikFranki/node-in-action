var debug;
if (process.env.DEBUG) { // 根据环境变量 DEBUG 定义 debug 函数
  debug = function(data) {
    console.error(data);
  };
} else {
  debug = function() {

  };
}

process.on('exit', function(code) { // 进程发出的特殊事件 exit
  console.log('Exiting...');
});

process.on('uncaughtException', function(err) { // 进程发出的特殊事件 uncaughtException
  console.error('got uncaught exception:', err.message);
  process.exit(1);
});

process.on('SIGINT', function() { // 捕获发送给进程的信号（SIGINT Node 默认行为是杀掉进程 SIGUSR1 Node 进入内置调试器 SIGWINCH Node 会重新设定 process.stdout.rows 和 process.stdout.columns，并发出一个 resize 事件）
  console.log('Got Ctrl-C!');
});


debug('this is a debug call');
console.log('Hello World!');
debug('this is another debug call');

throw new Error('an uncaught exception');