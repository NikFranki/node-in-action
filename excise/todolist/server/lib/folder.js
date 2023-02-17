const conn = require('../services/db');

class Folder {
  async getList(req, res, next) {
    conn.query(
      'SELECT * FROM folders ORDER BY create_time DESC',
      [],
      (err, list) => {
        if (err) return next(err);

        res.send(JSON.stringify({
          code: 200,
          message: 'success',
          list,
        }));
      });
  }

  addFolder(req, res, next) {
    if (!req.body.name) return next(new Error('content can not be empty!'));

    conn.query(
      `INSERT INTO folders (name, parent_id) VALUES (?, ?)`,
      [req.body.name, req.body.parent_id],
      (err) => {
        if (err) return next(err);

        res.send({
          code: 200,
          message: 'success',
        });
      });
  }

  updateFolder(req, res, next) {
    if (!req.body.id) return next(new Error('must specific id!'));

    conn.query(
      `UPDATE folders SET name=? WHERE id=?`,
      [req.body.name, req.body.id],
      (err) => {
        if (err) return next(err);

        res.send({
          code: 200,
          message: 'success',
        });
      });
  }

  deleteFolder(req, res, next) {
    if (!req.body.id) return next(new Error('must specific id!'));

    conn.query(
      `DELETE FROM folders WHERE id=?`,
      [req.body.id],
      (err) => {
        if (err) return next(err);

        res.send({
          code: 200,
          message: 'success',
        });
      });
  }
}

module.exports = Folder;