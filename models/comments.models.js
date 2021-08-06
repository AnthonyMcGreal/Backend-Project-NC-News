const db = require('../db/connection');
const format = require('pg-format');

exports.removeCommentsById = (comment_id) => {
  return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id]);
};
