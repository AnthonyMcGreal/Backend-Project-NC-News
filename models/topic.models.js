const db = require('../db/connection');
const format = require('pg-format');

exports.selectTopics = async () => {
  const topics = await db.query(`SELECT * FROM topics`);
  return topics.rows;
};

exports.insertTopic = (slug, description) => {
  if (slug === undefined || description === undefined) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  const queryStr = format(
    `
  INSERT INTO topics
  (slug, description)
  VALUES
  %L
  RETURNING *;`,
    [[slug, description]]
  );

  return db.query(queryStr).then(({ rows }) => {
    return rows[0];
  });
};
