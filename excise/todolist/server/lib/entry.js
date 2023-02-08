const uuid = require("uuid");
const dayjs = require('dayjs');
const conn = require('../services/db');

const FILTER_ALL = 1;
const FILTER_TODO = 2;
const FILTER_DONE = 3;

class Entry {
  constructor(obj) {
    for (const key in obj) { // 循环遍历传入对象的键
      this[key] = obj[key]; // 合并值
    }
  }

  async getList (req, res, next) {
    const {pageSize, pageNo, status, content} = req.body;
    const isGtFILTER_ALL = status > FILTER_ALL;
    const sqlTotal = 'SELECT * FROM todolist';
    const statusQuery = isGtFILTER_ALL ? ' WHERE status=?' : '';
    const contentQuery = content ? ` ${statusQuery ? 'AND' : 'WHERE'} content LIKE '${content}%'` : '';
    const paginationQuery = pageSize && pageNo ? ` LIMIT ${pageSize} OFFSET ${pageSize * (pageNo - 1)}` : '';
    const sqlStatus = `${sqlTotal}${statusQuery}${contentQuery} ORDER BY date DESC`;
    const query = `${sqlStatus}${paginationQuery}`;
    const values = [];
    if (isGtFILTER_ALL) {
      values.push(status);
    }
    if (content) {
      values.push(content);
    }
    conn.query(
      query,
      values,
      (err, data) => {
        if (err) return next(err);
  
        let list = [];
        switch (status) {
          case FILTER_ALL:
            list = data;
            break;
          case FILTER_TODO:
            list = data.filter(item => item.status === FILTER_TODO);
            break;
          case FILTER_DONE:
            list = data.filter(item => item.status === FILTER_DONE);
            break;
          default:
            list = data;
            break;
        }
  
        conn.query(sqlStatus, values, (err, result) => {
          if (err) return next(err);
  
          // 当发现 pageNo > Math.ceil(total / pageSize) 时，说明分页索引越界了，需要往前查询
          const pageCounts = Math.ceil(result.length / pageSize);
          if (pageNo > pageCounts) {
            req.body.pageNo = pageCounts;
            req.body.pageSize = pageSize;
            req.body.status = status;
            this.getList(req, res, next);
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

  async addTodo (req, res, next) {
    if (!req.body.content) return next(new Error('content can not be empty!'));
    if (!req.body.date) return next(new Error('date can not be empty!'));
  
    // TODO: id auto_increasement
    const values = [uuid.v4(), req.body.content, FILTER_TODO, req.body.date];
    conn.query(
      'INSERT INTO todolist (id, content, status, date) VALUES (?, ?, ?, ?)',
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
    if (!req.body.id) return next(new Error('must specific id!'));
  
    conn.query(
      `UPDATE todolist SET content=?, STATUS=?, date=? WHERE id=?`,
      [req.body.content, req.body.status, req.body.date, req.body.id],
      (err) => {
        if (err) return next(err);
  
        res.send(JSON.stringify({
          code: 200,
          message: 'success',
        }));
      });
  }

  async deleteTodo (req, res, next) {
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