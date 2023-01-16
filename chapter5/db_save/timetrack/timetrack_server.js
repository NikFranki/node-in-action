// 启动程序

// 程序设置及数据库连接初始化
var http = require('http');
var work = require('./timetrack');
var mysql = require('mysql');

// 连接数据库
var db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '1234567890',
  database: 'node-learnning',
});

// 请求路由
var server = http.createServer(function (req, res) {
  switch (req.method) {
    case 'POST': // HTTP POST 请求
      switch (req.url) {
        case '/':
          work.add(db, req, res);
          break;

        case '/archive':
          work.archive(db, req, res);
          break;

        case '/delete':
          work.delete(db, req, res);
          break;

        default:
          break;
      }
      break;

    case 'GET': // HTTP GET 请求
      switch (req.url) {
        case '/':
          work.show(db, res);
          break;

        case '/archived':
          work.showArchived(db, res);
          break;

        default:
          break;
      }
      break;

    default:
      break;
  }
});

// 创建数据库表
db.query(
  'CREATE TABLE IF NOT EXISTS work (' +
  'id INT(10) NOT NULL AUTO_INCREMENT, ' +
  'hours DECIMAL(5,2) DEFAULT 0, ' +
  'date DATE, ' +
  'archived INT(1) DEFAULT 0, ' +
  'description LONGTEXT, ' +
  'PRIMARY KEY(id))',
  function (err) {
    if (err) throw err;
    console.log('Server running at http://127.0.0.1:3000'); // 启动 HTTP 服务器
    server.listen(3000);
  }
);
