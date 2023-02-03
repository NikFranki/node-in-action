// 可能时重命名，并以复制为后备手段的 move() 函数

var fs = require('fs');

module.exports = function move(oldPath, newPath, callback) {
  fs.rename(oldPath, newPath, function(err) { // 调用 fs.rename() 并希望它能用
    if (err) {
      if (err.code === 'EXDEV') { // 如果出现 EXDEV 错误，用备用的复制技术
        copy(oldPath, newPath, callback);
      } else {
        callback(err); // 如果有其他错误，报告给使用者
      }
      return;
    }
    callback(); // 如果 fs.rename() 能用，则工作已经完成了
  });
};

function copy(oldPath, newPath, callback) {
  var readStream = fs.createReadStream(oldPath); // 读取原来的文件并把它输出到目标路径
  var writeStream = fs.createWriteStream(newPath);
  readStream.on('error', callback);
  writeStream.on('error', callback);
  readStream.on('close', function() {
    fs.unlink(oldPath, newPath); // 复制完成后断链（删除）原文件
  });
  readStream.pipe(writeStream);
}