const db = require('../db/connection');
const format = require('pg-format');
const { formatPostCommentsData } = require('../db/utils/data-manipulation');

exports.selectArticles = (sort_by = 'created_at', order = 'desc', topic) => {
  const validSortBy = [
    'created_at',
    'author',
    'votes',
    'title',
    'article_id',
    'topic',
  ];
  const validOrders = ['asc', 'desc'];

  if (!validSortBy.includes(sort_by) || !validOrders.includes(order)) {
    return Promise.reject({ status: 404, msg: 'Bad Request' });
  }

  const queryValues = [];
  let queryStr = `SELECT articles.article_id, title, articles.votes, topic, articles.author, articles.created_at, COUNT(comments.article_id) AS comment_count FROM articles
  LEFT JOIN comments
  ON comments.article_id = articles.article_id`;

  if (topic) {
    queryStr += ` WHERE topic = $1`;
    queryValues.push(topic);
  }
  queryStr += ` GROUP BY articles.article_id`;

  queryStr += ` ORDER BY ${sort_by} ${order.toUpperCase()};`;
  //console.log(queryStr);
  return db.query(queryStr, queryValues).then((articles) => {
    return articles.rows;
  });
};

exports.selectArticlesById = (article_id) => {
  return db
    .query(
      `SELECT * FROM articles 
        WHERE article_id = $1;`,
      [article_id]
    )
    .then((article) => {
      return article.rows[0];
    });
};

exports.updateArticleVotesById = (body, article_id) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [body.inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectCommentsById = (article_id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at,author,body
  FROM comments
  WHERE article_id = $1;
  `,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertCommentsById = (newComment) => {
  let formattedData = formatPostCommentsData(newComment);
  let inputUserString = format(
    `INSERT INTO users
  (username, name)
  VALUES
  %L;`,
    [[formattedData[0][0], formattedData[0][0]]]
  );

  let inputString = format(
    `INSERT INTO comments
 (author, body)
 VALUES
 %L
 RETURNING *;`,
    formattedData
  );
  return db.query(inputUserString).then(() => {
    return db.query(inputString).then(({ rows }) => {
      return rows[0];
    });
  });
};
