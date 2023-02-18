const uuid = require("uuid");
const dayjs = require('dayjs');
const conn = require('../services/db');

const FILTER_ALL = 1;
const FILTER_TODO = 2;
// const FILTER_DONE = 3;

class Entry {
  constructor(obj) {
    for (const key in obj) { // 循环遍历传入对象的键
      this[key] = obj[key]; // 合并值
    }
  }

  async getTodoById(req, res, next) {
    const { id } = req.body;

    conn.query(
      'SELECT * FROM todolist WHERE id=?',
      [id],
      (err, list) => {
        if (err) return next(err);

        res.send({
          code: 200,
          message: 'success',
          data: list.map((item) => {
            item.date = dayjs(item.date).format('YYYY-MM-DD');
            return item;
          })[0],
        });
      });
  }

  async getList(req, res, next) {
    const { status, content, pageSize, pageNo, } = req.body;
    const isGtFILTER_ALL = status > FILTER_ALL;
    // SELECT todolist.id, content, status, folder_id, folders.name as folder_name, date FROM todolist, folders WHERE todolist.folder_id = folders.id;
    const sqlTotal = 'SELECT todolist.id, content, status, folder_id, folders.name as folder_name, date FROM todolist, folders';
    const statusQuery = isGtFILTER_ALL ? ' WHERE status=?' : '';
    const contentQuery = content ? ` ${statusQuery ? 'AND' : 'WHERE'} content LIKE '${content}%'` : '';
    const folderQuery = ` ${statusQuery || contentQuery ? 'AND' : 'WHERE'} todolist.folder_id = folders.id`;
    const paginationQuery = pageSize && pageNo ? ` LIMIT ${pageSize} OFFSET ${pageSize * (pageNo - 1)}` : '';
    const sqlStatus = `${sqlTotal}${statusQuery}${contentQuery}${folderQuery} ORDER BY date DESC`;
    const query = `${sqlStatus}${paginationQuery}`;
    const values = [];
    if (isGtFILTER_ALL) {
      values.push(status);
    }
    if (content) {
      values.push(content);
    }

    const self = this;
    conn.query(
      query,
      values,
      (err, list) => {
        if (err) return next(err);

        conn.query(sqlStatus, values, (err, result) => {
          if (err) return next(err);

          // 当发现 pageNo > Math.ceil(total / pageSize) 时，说明分页索引越界了，需要往前查询
          const pageCounts = Math.ceil(result.length / pageSize);
          if (result.length > 0 && pageNo > pageCounts) {
            req.body.pageNo = pageCounts;
            req.body.pageSize = pageSize;
            req.body.status = status;
            self.getList(req, res, next);
            return;
          }

          res.send(JSON.stringify({
            code: 200,
            message: 'success',
            list: list.map((item) => {
              item.date = dayjs(item.date).format('YYYY-MM-DD');
              return item;
            }),
            pageNo,
            pageSize,
            total: result.length,
          }));
        });
      });
  }

  async addTodo(req, res, next) {
    if (!req.body.content) return next(new Error('content can not be empty!'));
    if (!req.body.date) return next(new Error('date can not be empty!'));

    // TODO: id auto_increasement
    const values = [uuid.v4(), req.body.content, FILTER_TODO, req.body.folder_id, req.body.date];
    conn.query(
      'INSERT INTO todolist (id, content, status, folder_id, date) VALUES (?, ?, ?, ?, ?)',
      values,
      (err) => {
        if (err) return next(err);

        res.send(JSON.stringify({
          code: 200,
          message: 'success',
        }));
      });
  }

  async updateTodo(req, res, next) {
    const { content, status, folder_id, date, id } = req.body;
    if (!id) return next(new Error('must specific id!'));

    const map = new Map([
      ['content=?', content],
      ['status=?', status],
      ['folder_id=?', folder_id],
      ['date=?', date],
    ]);
    const updateFields = Array.from(map).filter(([_, value]) => value !== undefined).map(([key, _]) => key).join(', ');
    const values = Array.from(map).filter(([_, value]) => value !== undefined).map(([_, value]) => value);

    conn.query(
      `UPDATE todolist SET ${updateFields} WHERE id=?`,
      [...values, id],
      (err) => {
        if (err) return next(err);

        res.send(JSON.stringify({
          code: 200,
          message: 'success',
        }));
      });
  }

  async deleteTodo(req, res, next) {
    if (!req.body.id) next(new Error('must specific id!'));

    conn.query(
      'DELETE FROM todolist WHERE id=?',
      [req.body.id],
      (err) => {
        if (err) return next(err);

        res.send(JSON.stringify({
          code: 200,
          message: 'success',
        }));
      });
  }
}

module.exports = Entry;