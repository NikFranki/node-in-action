var assert = require('assert');
var Todo = require('./todo');
var todo = new Todo();
var testCompleted = 0;

function deleteTest() {
  todo.add('Delete Me'); // 添加一些数据以便测试删除
  assert.equal(todo.getCount(), 1, '1 item should exist'); // 断言数据被正确添加
  todo.deleteAll(); // 删除所有记录
  assert.equal(todo.getCount(), 0, 'No items should exist'); // 断言记录已被删除
  testCompleted++; // 记录测试完成
}

function addTest() {
  todo.deleteAll(); // 删除之前所有的事项
  todo.add('Added'); // 添加事项
  assert.notEqual(todo.getCount(), 0, '1 item should exist');
  testCompleted++; // 记录测试完成
}

function doAsyncTest(cb) {
  todo.doAsync(function(value) { // 两秒后激活回调
    assert.ok(value, 'Callback should be passed true'); // 断言值为 true
    testCompleted++; // 记录测试完成
    cb(); // 完成后激活回调函数
  });
}

function throwsTest() {
  assert.throws(todo.add, /requires/); // 不带参数调用 todo.add
  testCompleted++; // 记录测试完成
}

deleteTest();
addTest();
throwsTest();
doAsyncTest(function() {
  console.log('Completed ' + testCompleted + ' tests');
});