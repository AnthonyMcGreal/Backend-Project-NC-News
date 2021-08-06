const db = require('../db/connection');
const format = require('pg-format');

exports.selectUsers = () => {
  return db.query('SELECT username FROM users').then((users) => {
    return users.rows;
  });
};

exports.selectUserByUsername = (username) => {
  let queryStr = format(`SELECT * FROM users WHERE username = %L;`, [
    [username],
  ]);

  return db.query(queryStr).then((user) => {
    return user.rows;
  });
};
