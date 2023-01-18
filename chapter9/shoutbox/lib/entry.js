// 创建消息模型

var redis = require('redis');
var db = redis.createClient(); // 创建 Redis 客户端实例

function Entry(obj) {
  for (var key in obj) { // 循环遍历传入对象的键
    this[key] = obj[key]; // 合并值
  }
}

Entry.prototype.save = function(fn) {
  var entryJSON = JSON.stringify(this); // 将保存的消息转换成 JSON 字符串

  db.lpush('entries', entryJSON, function(err) { // 将 JSON 字符串保存到 Redis 列表中
    if (err) return fn(err);

    fn();
  });
};

// 获取部分消息
Entry.getRange = function(from, to, fn) {
  db.lrange('entries', from, to, function(err, items) {
    if (err) return fn(err);

    var entries = [];
    items.forEach(function(item) {
      entries.push(JSON.parse(item)); // 解码之前保存为 JSON 的消息列表
    });

    fn(null, entries);
  });
};

Entry.count = function(fn) {
  db.llen('entries', fn);
};

module.exports = Entry;