// 会话中存放临时的消息

var express = require('express');
var res = express.response;

res.message = function (msg, type) {
  type = type || 'info';
  var sess = this.req.session;
  sess.messages = sess.messages || [];
  sess.messages.push({ type, string: msg });
};

res.error = function (msg) {
  return this.message(msg, 'error');
};

var messages = function() {
  return function(req, res, next) {
    res.locals.messages = req.session.messages || [];
    res.locals.removeMessages = function() {
      req.session.messages = [];
    };
    next();
  };
};

module.exports = messages;
