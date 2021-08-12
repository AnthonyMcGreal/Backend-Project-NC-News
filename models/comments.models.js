const db = require('../db/connection');
const format = require('pg-format');

exports.removeCommentsById = (comment_id) => {
  return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
    comment_id,
  ]);
};

exports.updateCommentsById = (comment_id, body) => {
  if (!body.hasOwnProperty('inc_votes') || typeof body.inc_votes !== 'number') {
    return Promise.reject({
      status: 400,
      msg: 'Bad Request',
    });
  }
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING body;`,
      [body.inc_votes, comment_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
