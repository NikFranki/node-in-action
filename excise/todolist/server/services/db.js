const mysql = require('mysql');

/* 创建连接 MySQL */
const conn = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '1234567890',
  database: 'todos',
});

/* 创建数据库表(todolist) */
conn.query(
  'CREATE TABLE IF NOT EXISTS todolist (' +
  'id VARCHAR(40) NOT NULL, ' +
  'content VARCHAR(512) NOT NULL, ' +
  'status INT(10) NOT NULL, ' +
  'date Date, ' +
  'PRIMARY KEY(id))',
);

/* 创建数据库表(user) */
conn.query(
  'CREATE TABLE IF NOT EXISTS user (' +
  'username VARCHAR(60) NOT NULL, ' +
  'password VARCHAR(100) NOT NULL)',
);

module.exports = conn;
