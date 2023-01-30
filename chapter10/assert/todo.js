// 待办事项清单的模型

function Todo() { // 定义代办事项数据库
  this.todos = [];
}

Todo.prototype.add = function(item) { // 添加待办事项
  if (!item) {
    throw new Error('Todo#add requires an item');
  }

  this.todos.push(item);
};

Todo.prototype.deleteAll = function() { // 删除所有的待办事项
  this.todos= [];
};

Todo.prototype.getCount = function() { // 取得待办事项的数量
  return this.todos.length;
};

Todo.prototype.doAsync = function(cb) {
  setTimeout(cb, 2000, true);
};

module.exports = Todo;