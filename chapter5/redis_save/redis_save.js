// 连接 redis 服务器
var redis = require('redis');
var client = redis.createClient();

client.on("connect", function () {
  console.log("You are now connected");
});

client.on('error', function (error) {
  console.log('Error: ' + error);
});

// 操作 redis 数据库

client.set('color', 'red', redis.print); // print 函数输出操作的结果，或者在出错的时候给出错误提示
client.get('color', function (err, value) {
  if (err) throw err;
  console.log('Got: ' + value);
});

// 使用哈希表来存储和获取数据

client.hmset('camping', { // 设定哈希表元素
  'shelter': '2-person tent',
  'cooking': 'compstove',
}, redis.print);

client.hmget('camping', 'cooking', function (err, value) { // 获取 cooking 的值
  if (err) throw err;
  console.log('Will be cooking with: ' + value);
});

client.hkeys('camping', function (err, keys) { // 获取哈希表的 keys
  if (err) throw err;
  keys.forEach(function (key, i) {
    console.log('  ' + key);
  });
});

// 使用链表存储和获取数据

client.lpush('tasks', 'Paint the bikeshed red.', redis.print);
client.lpush('tasks', 'Paint the bikeshed green.', redis.print);
client.lrange('tasks', 0, -1, function (err, items) { // 取出联调中的所有元素（0代表链表中的第一个元素，-1代表链表中的最后一个元素）
  if (err) throw err;
  items.forEach(function (item, i) {
    console.log('  ' + item);
  });
});

// 使用集合存储和获取数据

client.sadd('ip_addresses', '204.10.37.96', redis.print);
client.sadd('ip_addresses', '204.10.37.96', redis.print);
client.sadd('ip_addresses', '72.32.231.8', redis.print);
client.smembers('ip_addresses', function (err, members) {
  if (err) throw err;
  console.log(members);
});
