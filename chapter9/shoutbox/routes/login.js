// 实现用户登录

var express = require('express');
var router = express.Router();
var User = require('../lib/user');

// get login form
router.get('/', function(req, res, next) {
  res.render('login', {
    title: 'Login'
  });
});

// login form submit
router.post('/', function(req, res, next) {
  var data = req.body;
  User.authenticate(data.name, data.pass, function(err, user) { // 检查凭证
    if (err) return next(err); // 传递错误

    if (user) { // 处理凭证有效的用户
      req.session.uid = user.id;
      res.redirect('/'); // 重定向到记录列表页（首页）
    } else {
      res.error('Sorry! invalid credentials.'); // 输出错误消息
      res.redirect('back'); // 重定向回登录表单
    }
  });
});

module.exports = router;
