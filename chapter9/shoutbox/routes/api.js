var express = require('express');
var router = express.Router();
var User = require('../lib/user');
var Entry = require('../lib/entry');
var page = require('../lib/middleware/page');
// var basicAuth = require('express-basic-auth')

// router.get('/', basicAuth({ authorizer: User.authenticate }));
router.get('/', function(req, res, next) {
  next();
});

router.get('/user/:id', function(req, res, next) {
  User.get(req.params.id, function(err, user) {
    if (err) return next(err);

    if (!user.id) return res.send(404);

    res.json(user);
  });
});

router.get('/entries/:page?', page(Entry.count), function(req, res, next) {
  var page = req.page;
  Entry.getRange(page.from, page.to, function(err, entries) {
    if (err) return next(err);

    // res.json(entries); // 返回 json 的数据格式

    res.format({ // 实现内容协商
      'json': function() { // JSON 响应
        res.send(entries);
      },

      'xml': function() { // XML 响应
        // 编写 xml 定制代码
        // res.write('<entries>\n');

        // entries.forEach(function(entry) {
        //   res.write('  <entry>\n');
        //   res.write('    <title>' + entry.title + '</title>\n');
        //   res.write('    <body>' + entry.body + '</body>\n');
        //   res.write('    <username>' + entry.username + '</username>\n');
        //   res.write('  </entry>\n');
        // });

        // res.write('</entries>\n');

        res.render('entries/xml', { entries: entries }); // 简化 xml 定制代码，把这部分的代码移到模板文件里面
      },
    });
  });
});

module.exports = router;
