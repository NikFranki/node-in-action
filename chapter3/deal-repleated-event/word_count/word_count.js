var fs = require('fs');
const path = require('path');

var completeTasks = 0;
var tasks = [];
var wordCounts = {};
var filesDir = path.resolve(__dirname, './text');

function checkIfComplete() {
  completeTasks++;
  if (completeTasks === tasks.length) {
    for (var index in wordCounts) {
      console.log(index + ': ' + wordCounts[index]); // 当所有任务全部完成之后，列出文件中用到的每次单词以及用了多少次
    }
  }
}

function countWordsInText(text) {
  var words = text.toString().toLowerCase().split(/\W+/).sort();

  for (var index in words) {
    var word = words[index];
    if (word) {
      wordCounts[word] = wordCounts[word] ? wordCounts[word] + 1 : 1; // 对文中出现的单词进行次数统计
    }
  }
}

fs.readdir(filesDir, function (err, files) { // 得出 text 目录中的文件列表
  if (err) throw err;
  for (var index in files) {
    var task = (function (file) { // 定义处理每个文件的任务。每个任务都会调用一个异步读取文件的函数并对文件中使用的单词计数
      return function () {
        fs.readFile(file, function (err, text) {
          if (err) throw err;
          countWordsInText(text);
          checkIfComplete();
        });
      };
    })(filesDir + '/' + files[index]);
    tasks.push(task); // 把所有的任务都添加到函数调用数组中
  }
  for (var task in tasks) { // 开始并行执行所有任务
    tasks[task]();
  }
});