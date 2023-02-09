var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var photosRouter = require('./routes/photos');

var app = express();

// view engine setup 视图设置，引擎设定
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 设置图片上传地址
app.set('photosPath', path.join(__dirname, '/public/photos'));

app.set('title', 'My Application');

// 挂载中间件
app.use(logger('dev')); // 日志中间件
app.use(express.json()); // 处理 json 格式请求中间件
app.use(express.urlencoded({ extended: false })); // 处理 x-www-urlencoded 表单类型请求中间件
app.use(cookieParser()); // cookie解析中间件
app.use(express.static(path.join(__dirname, 'public'))); // 静态文件中间件


// 指定程序路由
app.use('/', indexRouter); // 处理根路径路由请求
app.use('/users', usersRouter); // 处理 users 下的路由请求
app.use('/photos', photosRouter); // 处理 photos 下的路由请求

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// 方便 debugger
// app.listen(3000, () => {
//   console.log("Server is listening on Port 3000");
// });

module.exports = app;
