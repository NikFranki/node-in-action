var memdb = require('..');
var assert = require('assert');

describe('memdb', function() { // 描述 memdb 功能
  this.beforeEach(function() {
    memdb.clear(); // 在每个测试用例之前都要清理数据库，保持测试的无状态性
  });

  describe('.save(doc)', function() { // 描述 .save() 方法的功能
    it('should save the document', function(done) { // 描述期望值
      var pet = { name: 'Tobi' };
      memdb.save(pet, function() {
        var ret = memdb.first({ name: 'Tobi' });
        assert(JSON.stringify(ret) == JSON.stringify(pet)); // 确保找到了 pet
        done();
      });
    });
  });
});

describe('.first(obj)', function() {
  it('should return the first matching doc', function() { // 对 .first() 的第一个期望
    var tobi = { name: 'Tobi' };
    var loki = { name: 'Loki' };

    memdb.save(tobi); // 保存两个文档
    memdb.save(loki);

    var ret = memdb.first({ name: 'Tobi' }); // 确保每个都可以正确返回
    assert(JSON.stringify(ret) == JSON.stringify(tobi));

    var ret = memdb.first({ name: "Loki" });
    assert(JSON.stringify(ret) == JSON.stringify(loki));
  });

  it('should return null when no doc matches', function() { // 对 .first() 的第二个期望
    var ret = memdb.first({ name: 'Manny' });

    assert(ret === undefined);
  });
});