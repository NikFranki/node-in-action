var fs = require('fs');
var http = require('http');

function getEntries() { // 读取和解析博客文章文本的函数
  var entries = [];
  var entriesRaw = fs.readFileSync('./entries.txt', 'utf8');  // 从文件中读取博客文章的数据

  entriesRaw = entriesRaw.split('---'); // 解析文本，将它们分成一篇篇文章

  entriesRaw.forEach(function(entryRaw) {
    var entry = {};
    var lines = entryRaw.split('\n'); // 解析文章的文本，将它们逐行分解

    lines.forEach(function(line) { // 逐行解析，提取出文章的属性
      if (line.indexOf('title: ') === 0) {
        entry.title = line.replace('title: ', '');
      } else if (line.indexOf('date: ') === 0) {
        entry.date = line.replace('date: ', '');
      } else {
        entry.body = entry.body || '';
        entry.body += line;
      }
    });
    entries.push(entry);
  });

  return entries;
}

var server = http.createServer(function(req, res) {
  var entries = getEntries();
  var output = blogPage(entries);

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(output);
});

server.listen(8000);
console.log('Server is running at http://127.0.0.1:8000');

// blogPage 的实现
// 1. 不使用模板
// 2. 使用模板

/**
 * 方式一：不适用模板
 */
// function blogPage(entries) {
//   var output = '<html>'
//     + '<head>'
//     + '<style type="text/css">'
//     + '.entry_title { font-weight: bold; }'
//     + '.entry_date { font-style: italic; }'
//     + '.entry_body { margin-bottom: 1em; }'
//     + '</style>'
//     + '</head>'
//     + '<body>';

//   entries.forEach(function(entry) {
//     output += '<div class="entry_title">' + entry.title + '</div>\n'
//       + '<div class="entry_date">' + entry.date + '</div>\n'
//       + '<div class="entry_body">' + entry.body + '</div>\n';
//   });

//   output += '</body></html>'

//   return output;
// }

/**
 * 方式二：使用模板 ejs
 */
var ejs = require('ejs');
var template = fs.readFileSync('./template/blog_page.ejs', 'utf8');
function blogPage(entries) {
  var values = { entries };

  return ejs.render(template, values);
}

