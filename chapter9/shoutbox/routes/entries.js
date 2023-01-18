var express = require('express');
var router = express.Router();

var Entry = require('../lib/entry');
var validate = require('../lib/middleware/validate');
var page = require('../lib/middleware/page');

router.get('/', page(Entry.count, 5), function(req, res, next) {
  var page = req.page;
  Entry.getRange(page.from, page.to, function(err, entries) { // 获取消息
    if (err) return next(err);

    res.render('entries', { // 渲染 HTTP 响应
      title: 'Entries',
      entries,
    });
  });
});

router.get('/post', function(req, res, next) {
  res.render('post', {
    title: 'Post',
  });
});

router.post('/post', validate.required('title'), validate.lengthAbove('body', 10), function(req, res, next) {
  var data = req.body;

  var entry = new Entry({
    username: res.locals.user.name,
    title: data.title,
    body: data.body,
  });

  entry.save(function(err) {
    if (err) return next(err);
    
    res.redirect('/');
  });
});

router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err) {
    if (err) throw err;

    res.redirect('/');
  });
});

module.exports = router;
