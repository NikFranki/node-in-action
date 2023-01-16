// 程序功能模块

var qs = require('querystring');

// 发送 HTML 响应
exports.sendHtml = function (res, html) {
  res.setHeader('Content-Type', 'text/html; charset=utf8');
  res.setHeader('Content-Length', Buffer.byteLength(html));
  res.end(html);
};

// 解析 HTTP POST 数据
exports.parseReceivedData = function (req, cb) {
  var body = '';
  req.setEncoding('utf8');
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    var data = qs.parse(body);
    cb(data);
  });
};

// 渲染简单的表单
exports.actionForm = function (id, path, label) {
  var html = '<form method="POST" action="' + path + '">' +
    '<input type="hidden" name="id" value="' + id + '">' +
    '<input type="submit" value="' + label + '" />' +
    '</form>';
  return html;
};

// 添加工作记录
exports.add = function (db, req, res) {
  exports.parseReceivedData(req, function (work) { // 解析 HTTP POST 数据
    db.query(
      'INSERT INTO work (hours, date, description) ' + // 添加工作记录的 SQL 语句
      ' VALUES (?, ?, ?)',
      [work.hours, work.date, work.description], // 工作记录数据
      function (err) {
        if (err) throw err;
        exports.show(db, res); // 展示工作记录清单
      }
    )
  });
}

// 删除工作记录
exports.delete = function (db, req, res) {
  exports.parseReceivedData(req, function (work) { // 解析 HTTP POST 数据
    db.query(
      'DELETE FROM work WHERE id=?', // 删除工作记录的 SQL
      [work.id], // 工作记录 ID
      function (err) {
        if (err) throw err;
        exports.show(db, res); // 展示工作记录清单
      }
    )
  })
};

// 归档一条工作记录
exports.archive = function (db, req, res) {
  exports.parseReceivedData(req, function (work) { // 解析 HTTP POST 数据
    db.query(
      'UPDATE work SET archived=1 WHERE id=?', // 更新工作记录的 SQL
      [work.id], // 删除记录 ID
      function (err) {
        if (err) throw err;
        exports.show(db, res); // 展示工作记录清单
      }
    );
  });
};

// 获取工作记录
exports.show = function (db, res, showArchived) {
  var query = 'SELECT  * FROM work ' + 'WHERE archived=? ' + 'ORDER BY date DESC'; // 获取工作记录的 SQL
  var archivedValue = showArchived ? 1 : 0;
  db.query(
    query,
    [archivedValue], // 想要的工作记录归档状态
    function (err, rows) {
      if (err) throw err;
      var html = showArchived
        ? ''
        : '<a href="/archived">Archived Work</a><br />';
      html += exports.workHitlistHtml(rows); // 将结果转为 HTML 表格
      html += exports.workFromHtml();
      exports.sendHtml(res, html); // 给用户发送 HTML 响应
    }
  );
};

// 只显示归档的工作记录
exports.showArchived = function (db, res) {
  exports.show(db, res, true);
};

// 将工作记录渲染为 HTML 表格
exports.workHitlistHtml = function (rows) {
  var html = '<table>';
  for (var i in rows) { // 将每条工作记录渲染为 HTML 表格的一行
    html += '<tr>';
    html += '<td>' + rows[i].date + '</td>';
    html += '<td>' + rows[i].hours + '</td>';
    html += '<td>' + rows[i].description + '</td>';
    if (!rows[i].archived) { // 如果工作记录还没归档，展示归档按钮
      html += '<td>' + exports.workArchiveForm(rows[i].id) + '</td>'
    }
    html += '<td>' + exports.workDeleteForm(rows[i].id) + '</td>';
    html += '</tr>';
  }
  html += '</table>';
  return html;
};

// 添加、归档、删除工作记录的 HTML 表单
exports.workFromHtml = function () {
  var html = '<form method="POST" action="/">' + // 渲染用来输入新工作记录的表单
    '<p>Date (YYYY-MM-DD):<br /><input name="date" type="text"></p>' +
    '<p>Hours worked:<br /><input name="hours" type="text" /></p>' +
    '<p>Description:<br />' +
    '<textarea name="description"></textarea></p>' +
    '<input type="submit" value="Add" />'
  '</form>';
  return html;
};

// 渲染归档按钮表单
exports.workArchiveForm = function (id) {
  return exports.actionForm(id, '/archive', 'Archive');
};

// 渲染删除按钮表单
exports.workDeleteForm = function (id) {
  return exports.actionForm(id, '/delete', 'Delete');
};