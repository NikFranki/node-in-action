var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session'); 
// custom midlleware
var user = require('./lib/middleware/user');
var notfound = require('./lib/middleware/notfound');
var error = require('./lib/middleware/error');

var messages = require('./lib/messages.js');

var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var entriesRouter = require('./routes/entries');
var errorRoute = require('./routes/error_route');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// not sure whether in use
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));
// 加载保存用户数据中间件
app.use(user);
// 加载消息中间件
app.use(messages());

// load router
app.use('/', entriesRouter);
app.use('/api', apiRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);

if (process.env.ERROR_ROUTE) {
  app.use('/dev/error', errorRoute);
}

// deal with error
app.use(notfound);
app.use(error);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
