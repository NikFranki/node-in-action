// bodyParser 解析请求体
// 实际上整合了三个小组件：json()、urlencoded()、multipart()，分别用来解析 josn、x-www-form-urlencoded、multipart/form-data

var connect = require('connect');
const bodyParser = require('body-parser');

var app = connect()
  .use(bodyParser.json({ limit: '300kb' }))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(function(req, res) {
    // res.end('Registered new user: ' + req.body.username);
    console.log(req.body);
    console.log(req.files);
    res.end('Thanks!');
  });

app.listen(3000);
console.log('Server is running at http://127.0.0.1:3000');

