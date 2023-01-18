module.exports = function(err, req, res, next) { // 错误处理器必须有四个参数
  console.error(err.stack); // 将错误输出到 stderr 流中
  var msg;

  switch (err.type) { // 具体的错误示例
    case 'database':
      msg = 'Server Unvailable';
      res.statusCode = 503;
      break;
    default:
      msg = 'Internal Server Error';
      res.statusCode = 500;
  }

  res.format({
    html: function() { // 可以接受 HTML 时渲染模板
      res.render('5xx', { msg: msg, status: res.statusCode });
    },
    json: function() { // 可以接受 JSON 时发送的响应
      res.send({ error: msg });
    },
    text: function() { // 响应普通文本
      res.send(msg + '\n');
    }
  });
};