var connect = require('connect');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
var session = require('express-session');

var count = 0;
var hour = 3600000;
var sessionOpts = {
  key: 'myapp_id',
  cookie: { maxAge: hour * 24, secure: true },
};
var app = connect()
  .use(favicon(path.join(__dirname, '/', 'favicon.png')))
  .use(cookieParser('tobi is a cool ferret'))
  .use(session(sessionOpts))
  .use(function(req, res, next) {
    var sess = req.session;
    if (sess.views) {
      res.setHeader('Content-Type', 'text/html');
      res.write('<p>views: ' + count + '</p>');
      res.end();
      sess.views += 1;
      count++;
    } else {
      sess.views = 1;
      count = 1;
      res.end('Welcome to the session demo. refresh!');
    }
  });

app.listen(3000);

console.log('Server is running at http://127.0.0.1:3000');