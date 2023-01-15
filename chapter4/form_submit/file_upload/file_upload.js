// 处理文件上传

var http = require('http');
var formidable = require('formidable');

var server = http.createServer(function (req, res) {
  switch (req.method) {
    case 'GET':
      show(req, res);
      break;

    case 'POST':
      upload(req, res);
      break;

    default:
      break;
  }
});

function show(req, res) {
  var html = '<form method="post" action="/" enctype="multipart/form-data">' +
    '<p><input type="text" name="name" /></p>' +
    '<p><input type="file" name="file" /></p>' +
    '<p><input type="submit" value="Upload" /></p>' +
    '</form>';

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(html));
  res.end(html);
}

function upload(req, res) {
  if (!isFormData(req)) {
    res.statusCode = 400;
    res.end('Bad Request: expecting multipart/form-data');
    return;
  }

  var form = new formidable.IncomingForm();

  // form.on('field', function (field, value) {
  //   console.log(field);
  //   console.log(value);
  // });

  // form.on('file', function (name, file) {
  //   console.log(name);
  //   console.log(file);
  // });

  // form.on('end', function () {
  //   res.end('upload complete!');
  // });

  // form.parse(req);

  // 使用更高级的 api 实现
  form.parse(req, function (err, fields, files) {
    console.log(fields);
    console.log(files);
    res.end('upload complete!');
  });

  // 计算上传进度
  form.on('progress', function (bytesReceived, bytesExpected) {
    var percent = Math.floor(bytesReceived / bytesExpected * 100);
    console.log(percent)
  });
}

function isFormData(req) {
  var type = req.headers['content-type'] || '';
  return type.indexOf('multipart/form-data') === 0;
}

server.listen(3000);
console.log('Server is running at http://127.0.0.1:3000')