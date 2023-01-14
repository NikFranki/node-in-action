// blog 简单的回调函数，处理一次性事件

var http = require('http');
var fs = require('fs');

// 版本1 回调嵌套较多
// http.createServer(function (req, res) { // 创建 http 服务器，并回调定义响应逻辑
//   if (req.url === '/') {
//     fs.readFile('./titles.json', function (err, data) { // 读取 JSON 文件并回调定义如何处理其中的内容
//       if (err) { // 如果出错，返回错误日志
//         console.error(err);
//         res.end('Server Error');
//       } else {
//         var titles = JSON.parse(data.toString()); // 解析 JSON 数据

//         fs.readFile('./template.html', function (err, data) { // 读取 HTML 模块，并在加载完成后使用回调
//           if (err) {
//             console.error(err);
//             res.end('Server Error');
//           } else {
//             var teml = data.toString();

//             var html = teml.replace('%', titles.join('</li><li>')); // 组装 HTML 页面以显示博客标题
//             res.writeHead(200, { 'Content-Type': 'text/html' }); // 把 HTML 页面发送给用户
//             res.end(html);
//           }
//         });
//       }
//     });
//   }
// }).listen(8000, '127.0.0.1');

// 版本2 创建中间函数以减少嵌套的例子
// var server = http.createServer(function (req, res) { // 客户端请求一开始会先进入这里
//   getTitles(res);
// }).listen(8000, '127.0.0.1');

// // 获取标题
// function getTitles(res) {
//   fs.readFile('./titles.json', function (err, data) {
//     if (err) {
//       hadError(err, res);
//     } else {
//       getTemplate(JSON.parse(data.toString()), res); // 获取标题，并将控制权交给 getTemplate
//     }
//   });
// }

// // 读取模板文件，将控制权转交给 formatHtml
// function getTemplate(titles, res) {
//   fs.readFile('./template.html', function (err, data) {
//     if (err) {
//       hadError(err, res);
//     } else {
//       formatHtml(titles, data.toString(), res);
//     }
//   });
// }

// // 得到标题和模板，渲染一个响应给客户端
// function formatHtml(titles, tmpl, res) {
//   var html = tmpl.replace('%', titles.join('</li><li>'));
//   res.writeHead(200, { 'Content-Type': 'text/html' });
//   res.end(html);
// }

// // 出过上述过程中任意环节出错，则报错提示客户端
// function hadError(err, res) {
//   console.error(err);
//   res.end('Server Error');
// }

// 版本3 通过尽早返回减少嵌套
var server = http.createServer(function (req, res) { // 客户端请求一开始会先进入这里
  getTitles(res);
}).listen(8000, '127.0.0.1');

// 获取标题
function getTitles(res) {
  fs.readFile('./titles.json', function (err, data) {
    if (err) return hadError(err, res); // 直接 return, 如果出错，不进行后续的程序执行
    getTemplate(JSON.parse(data.toString()), res); // 获取标题，并将控制权交给 getTemplate
  });
}

// 读取模板文件，将控制权转交给 formatHtml
function getTemplate(titles, res) {
  fs.readFile('./template.html', function (err, data) {
    if (err) return hadError(err, res); // 直接 return, 如果出错，不进行后续的程序执行
    formatHtml(titles, data.toString(), res);
  });
}

// 得到标题和模板，渲染一个响应给客户端
function formatHtml(titles, tmpl, res) {
  var html = tmpl.replace('%', titles.join('</li><li>'));
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
}

// 出过上述过程中任意环节出错，则报错提示客户端
function hadError(err, res) {
  console.error(err);
  res.end('Server Error');
}


console.log('Server is running at http://127.0.0.1:8000');