var connect = require('connect');
const qs = require('querystring');

var app = connect()
  .use(function(req, res, next) {
    req.query = qs.parse(req.url);
    next();
  })
  .use(function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(req.query));
  });

app.listen(3000);

console.log('Server is running at http://127.0.0.1:3000');