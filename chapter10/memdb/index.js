var db = [];

exports.save = function(doc, cb) {
  db.push(doc); // 将文档添加到数据库数组中
  if (cb) {
    setTimeout(function() {
      cb();
    }, 1000);
  }
};

exports.first = function(obj) {
  return db.filter(function(doc) { // 选择跟 obj 的所有属性相匹配的文档
    for (var key in obj) {
      if (doc[key] !== obj[key]) { // 不匹配返回 false，不选择这个文档
        return false;
      }
    }
    return true; // 全都匹配，返回并选择这个文档
  }).shift(); // 只要第一个文档或者 null
};

exports.clear = function() {
  db = [];
};