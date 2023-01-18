// 创建用户模型

var redis = require('redis');
var bcrypt = require('bcrypt');

var client = redis.createClient();

client.on("connect", function() {
  console.log("You are now connected");
});

client.on('error', function(error) {
  console.log('Error: ' + error);
});

function User(obj) {
  for (let key in obj) { // 合并属性
    this[key] = obj[key];
  }
}

// 用户模型中的 save 实现
User.prototype.save = function(fn) {
  if (this.id) { // 用户已经存在
    this.update(fn);
  } else {
    var user = this;
    client.incr('user:ids', function(err, id) { // 创建唯一 ID
      if (err) return fn(err);

      user.id = id; // 设定 ID，以便保存
      user.hashPassword(function(err) { // 密码哈希
        if (err) return fn(err);

        user.update(fn); // 保存用户属性
      });
    });
  }
};

User.prototype.update = function(fn) {
  var user = this;
  var id = user.id;
  client.set('user:id:' + user.name, id, function(err) { // 用名称索引用户 ID
    if (err) return fn(err);

    var newUser = {};
    for (let key in user) {
      if (user.hasOwnProperty(key)) {
        newUser[key] = user[key];
      }
    }

    client.hmset('user:' + id, newUser, function(err) { // 用 Redis 哈希存储数据
      fn(err);
    });
  });
};

// 在用户模型中添加 bcrypt 加密
User.prototype.hashPassword = function(fn) {
  var user = this;
  var saltRounds = 12;
  bcrypt.genSalt(saltRounds, function(err, salt) { // 生成有 12 个字符的盐
    if (err) return fn(err);

    user.salt = salt; // 设定盐以便存储
    bcrypt.hash(user.pass, salt, function(err, hash) { // 生成哈希
      if (err) return fn(err);

      // Store hash in your password DB.
      user.pass = hash; // 设定哈希以便存储
      fn();
    });
  });
};

// 获取用户数据
User.getByName = function(name, fn) {
  User.getId(name, function(err, id) { // 通过用户名称找到 ID
    if (err) return fn(err);

    User.get(id, fn); // 通过 ID 找到用户信息
  });
};

// 查找 id
User.getId = function(name, fn) {
  client.get('user:id:' + name, fn); // 取得由名称索引的 ID
};

// 通过 id 找到用户信息
User.get = function(id, fn) {
  client.hgetall('user:' + id, function(err, user) { // 获取平台对象哈希
    if (err) return fn(err);

    fn(null, new User(user)); // 将普通对象转换成新的 User 对象
  });
};

// 认证用户登录
User.authenticate = function(name, pass, fn) {
  User.getByName(name, function(err, user) { // 通过名称查找用户
    if (err) return fn(err);
    if (!user.id) return fn(); // 用户不存在

    bcrypt.hash(pass, user.salt, function(err, hash) { // 对给出的密码做哈希处理
      if (err) return fn(err);

      if (hash === user.pass) return fn(null, user); // 匹配发现项
      fn();
    });
  });
};

// 去掉敏感数据
User.prototype.toString = function( ){
  return {
    id: this.id,
    name: this.name
  };
};

// test
// var tobi = new User({
//   name: 'Tobi',
//   pass: 'i am a ferret',
//   age: '2'
// });

// tobi.save(function(err) {
//   if (err) throw err;

//   console.log('user id %d', tobi.id);
// });

module.exports = User;
