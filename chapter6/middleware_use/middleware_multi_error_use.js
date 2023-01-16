var connect = require('connect');

function hello(req, res, next) {
  if (req.url.match(/^\/hello/)) {
    res.end('Hello World\n');
  } else {
    next();
  }
}

var db = {
  users: [
    { name: 'tobi' },
    { name: 'loki' },
    { name: 'jane' },
  ]
};

function users(req, res, next) {
  var match = req.url.match(/^\/users\/(.+)/);
  if (match) {
    var user = db.users.find(function (item) {
      return item.name === match[1];
    });
    if (user) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(user));
    } else {
      var err = new Error('User not found');
      err.notFound = true;
      next(err);
    }
  } else {
    next();
  }
}

function pets(req, res, next) {
  if (req.url.match(/^\/pets\/(.+)/)) {
    foo();
  } else {
    next();
  }
}

function errorHandler(err, req, res, next) {
  console.log(err.stack);
  res.setHeader('Content-Type', 'application/json');
  if (err.notFound) {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: err.message }));
  } else {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}

function errorPage(err, req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.end({ error: 'page error' });
}

var api = connect()
  .use(users)
  .use(pets)
  .use(errorHandler);

var app = connect()
  .use(hello)
  .use('/api', api)
  .use(errorPage)
  .listen(3000);

console.log('Server is running at http://127.0.0.1:3000');