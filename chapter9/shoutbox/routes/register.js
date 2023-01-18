// 实现用户注册

var express = require('express');
var router = express.Router();
var User = require('../lib/user');

// get registry form
router.get('/', function(req, res, next) {
  res.render('register', {
    title: 'Register'
  });
});

// registry form submit
router.post('/', function(req, res, next) {
  var data = req.body;
  User.getByName(data.name, function(err, user) { // 检查用户名是否唯一
    if (err) return next(err); // 顺延传递数据库连接错误和其他错误

    if (user.id) { // 用户名已被占用
      res.error('Username already taken!');
      res.redirect('back');
    } else {
      user = new User({ // 用 post 数据创建用户
        name: data.name,
        pass: data.pass
      });

      user.save(function(err) { // 保存新用户
        if (err) return next(err);

        req.session.uid = user.id; // 为认证保存 uid
        res.redirect('/'); // 重定向到记录的列表页（首页）
      });
    }
  });
});

module.exports = router;
