function getField(req, field) {
  var val = req.body;

  return val[field];
}

exports.required = function(field) {
  return function(req, res, next) {
    if (getField(req, field)) { // 每次收到请求都检查输入域是否有值
      next();
    } else {
      res.error(field + ' is required!');
      res.redirect('back');
    }
  };
};

exports.lengthAbove = function(field, len) {
  return function(req, res, next) {
    if (getField(req, field).length > len) {
      next();
    } else {
      res.error(field + ' must have more than ' + len + ' characters');
      res.redirect('back');
    }
  };
};