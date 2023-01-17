var connect = require('connect');

var app = connect()
  .use(function(req, res, next) {
    console.log(req.url);
    console.log(req.method);
    next();
  })
  .use(function(req, res, next) {
    res.end('Thanks!');
  });

app.listen(3000);

console.log('Server is running at http://127.0.0.1:3000');