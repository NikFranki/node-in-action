var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var err = new Error('database connection failed');
  err.type = 'database';
  next(err);
});

module.exports = router;
