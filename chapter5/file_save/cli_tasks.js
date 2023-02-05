// 基于文件存储数据 - 改造 todolist 的存取逻辑

var fs = require('fs');
var path = require('path');
var args = process.argv.splice(2); // 去掉 node cli_tasks.js，只留下参数
var common = args.shift(); // 取出第一个参数
var taskDescription = args.join(' '); // 合并剩余的参数
var file = path.join(process.cwd(), './.tasks'); // 根据当前的工作目录解析数据库的相对路径

switch (common) {
  case 'list': // 列举所有已经保存的任务
    listTasks(file);
    break;

  case 'add': // 添加新任务
    addTask(file, taskDescription);
    break;

  default:
    console.log('Usage: ' + process.argv[0] + ' list|add [taskDescription]');
    break;
}

// 从文本文件中加载用 JSON 编码的数据
function loadOrInitializeTaskArray(file, cb) {
  fs.exists(file, function (exists) { // 检查 .tasks 文件是否存在
    var tasks = [];
    if (exists) {
      fs.readFile(file, 'utf8', function (err, data) { // 从 .tasks 文件中读出待办事项
        if (err) throw err;
        var data = data.toString();
        tasks = JSON.parse(data || '[]');
        cb(tasks);
      });
    } else {
      cb([]);
    }
  });
}

// 列举所有已经保存的代办事项
function listTasks(file) {
  loadOrInitializeTaskArray(file, function (tasks) {
    for (var i in tasks) {
      console.log(tasks[i]);
    }
  });
}

// 存储代办事项
function storeTasks(file, tasks) {
  fs.writeFile(file, JSON.stringify(tasks), 'utf8', function (err) {
    if (err) throw err;
    console.log('Saved.');
  });
}

// 添加代办事项
function addTask(file, taskDescription) {
  loadOrInitializeTaskArray(file, function (tasks) {
    tasks.push(taskDescription);
    storeTasks(file, tasks);
  });
}