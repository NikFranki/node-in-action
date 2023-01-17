var connect = require('connect');
const path = require('path');
const favicon = require('serve-favicon');

var app = connect()
  .use(favicon(path.join(__dirname, '/', 'favicon.png')))
  .use(function(req, res, next) {
    res.end('Thanks!');
  });

app.listen(3000);

console.log('Server is running at http://127.0.0.1:3000');