var jade = require('jade');
var fs = require('fs');
var http = require('http');

function blog_page() {
  var template = fs.readFileSync('./template/blog_page.jade', 'utf8');
  var context = {
    title: 'Hello template',
    nodeUrl: 'http://nodejs.org',
    messages: [
      'You have logged in successfully',
      'Welcome back!'
    ],
    post: {
      title: 'xx',
      date: '20230123',
      body: 'haha'
    },
    results: [
      {title: 'ss', content: '123'},
      {title: 'sss', content: '456'}
    ]
  };
  var fn = jade.compile(template);
  return fn(context);
}

var server = http.createServer(function(req, res) {
  var output = blog_page();

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(output);
});

server.listen(8000);
console.log('Server is running at http://127.0.0.1:8000');
