const conn = require('../services/db');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, req.app.get('imagesPath'));
  },
  filename: (req, file, callback) => {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

class User {
  constructor(obj) {
    for (const key in obj) { // 循环遍历传入对象的键
      this[key] = obj[key]; // 合并值
    }
  }

  async register(req, res, next) {
    if (!req.file) {
      return next(new Error('no file upload'));
    }

    const avatar = 'http://localhost:8000/images/' + req.file.filename;
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    conn.query(
      `SELECT * FROM user WHERE username=?`,
      [username],
      (err, result) => {
        if (err) return next(err);
        if (result.length !== 0) return next(new Error('user already exists'));

        conn.query(
          'INSERT INTO user VALUES (?,?,?)',
          [username, hashedPassword, avatar],
          (err, result) => {
            if (err) return next(err);

            res.statusCode = 201;
            res.send(JSON.stringify({
              code: 200,
              message: 'success',
            }));
          }
        );
      });
  }

  login(req, res, next) {
    const { username, password } = req.body;
    conn.query(
      `SELECT * FROM user WHERE username=?`,
      [username],
      async (err, result) => {
        if (err) return next(err);

        if (result.length === 0) {
          res.statusCode = 404;
          res.send(JSON.stringify({
            code: -1,
            message: 'user does not exist',
          }));
          return next(new Error('user does not exist'));
        }

        const hashedPassword = result[0].password;
        const isPasswordEqual = await bcrypt.compare(password, hashedPassword);
        if (isPasswordEqual) {
          res.send(JSON.stringify({
            code: 200,
            message: `${username} is logged in!`,
            data: {
              username: result[0].username,
              avatar: result[0].avatar,
            },
          }));
        } else {
          res.send(JSON.stringify({
            code: -1,
            message: 'password incorrect!',
          }));
        }
      });
  }
}

module.exports = { User, upload };