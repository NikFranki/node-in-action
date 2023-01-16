// 连接的打开
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/mydatabase');

// 连接的关闭
// mongoose.disconnect();

// 注册 schema
var Schema = mongoose.Schema;
var Tasks = new Schema({
  project: String,
  description: String,
});
mongoose.model('Task', Tasks);

// 添加任务
var Task = mongoose.model('Task');
var task = new Task();
task.project = 'Bikeshed';
task.description = 'Paint the bikeshed red.';
task.save(function(err) {
  if (err) throw err;
  console.log('Task saved.');
});

// 搜索文档
var Task = mongoose.model('Task');
Task.find({ project: 'Bikeshed' }, function(err, tasks) {
  for (var i = 0; i < tasks.length; i++) {
    console.log('ID: ' + tasks[i].__id);
    console.log(tasks[i].description);
  }
});

// 更新文档
var Task = mongoose.model('Task');
Task.update(
  {},
  { description: 'Paint the bikeshed green.' },
  { multi: false },
  function(err, rows_updated) {
    if (err) throw err;
    console.log('Updated.')
  }
);

// 删除文档
var Task = mongoose.model('Task');
Task.findById('xx', function(err, task) {
  task.remove();
});