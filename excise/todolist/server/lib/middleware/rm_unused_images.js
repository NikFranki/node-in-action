const fs = require('fs');
const path = require('path');
const conn = require('../../services/db');

module.exports = function(req, res, next) {
  conn.query(
    `SELECT * FROM user`,
    [],
    async (err, result) => {
      if (err) return next(err);

      // 获取所有的头像图片地址
      const avatars = result.map((item) => item.avatar.replace(req.app.get('serverPath'), ''));

      // 进入 public/images 目录，把不存在的用户头像文件删除
      const pathName =  req.app.get('imagesPath');
      fs.stat(pathName, (error, stats) => {
        if (error) {
          return next(error);
        }

        if (stats.isDirectory()) {
          fs.readdir(pathName, (error, files) => {
            if (error) {
              return next(error);
            }

            const filenames = [];
            (function iterator(count) {
              if (count === files.length) {
                filenames
                .filter(filename => !avatars.includes(filename))
                .forEach(filename => {
                  fs.unlink(`${pathName}${filename}`, (error) => {
                    return next(error);
                  });
                });
                
                return next();
              }

              fs.stat(path.join(pathName, files[count]), (error, stats) => {
                if (error) {
                  return next(error);
                }

                if (stats.isFile() && /\.(jpg|jpeg|png|GIF|JPG|PNG)$/.test(files[count])) {
                  filenames.push(files[count]);
                }

                iterator(count + 1);
              })
            })(0);
          });
        }
      });
    });
};