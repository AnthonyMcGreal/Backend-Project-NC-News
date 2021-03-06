const db = require('../db/connection');
const format = require('pg-format');
const { formatPostCommentsData } = require('../db/utils/data-manipulation');

exports.selectArticles = (
  sort_by = 'created_at',
  order = 'desc',
  topic,
  limit = 10,
  page = 1
) => {
  const offset = limit * page - limit;
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
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }

  const queryValues = [limit, offset];
  let queryStr = `SELECT articles.article_id, title, articles.votes, topic, articles.author, articles.created_at, COUNT(comments.article_id) AS comment_count FROM articles
  LEFT JOIN comments
  ON comments.article_id = articles.article_id`;

  if (topic) {
    queryStr += ` WHERE topic = $3`;
    queryValues.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id`;

  queryStr += ` ORDER BY ${sort_by} ${order.toUpperCase()} `;

  queryStr += `LIMIT $1 OFFSET $2;`;
  return db.query(queryStr, queryValues).then((articles) => {
    return articles.rows;
  });
};

exports.selectArticlesById = (article_id) => {
  return db
    .query(
      `SELECT articles.article_id, title, articles.body, articles.votes, topic, articles.author, articles.created_at, COUNT(comments.article_id) AS comment_count
      FROM articles
      LEFT JOIN comments
      ON comments.article_id = articles.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id`,
      [article_id]
    )
    .then((article) => {
      return article.rows[0];
    });
};

exports.updateArticleVotesById = (body, article_id) => {
  if (!body.hasOwnProperty('inc_votes') || typeof body.inc_votes !== 'number') {
    return Promise.reject({
      status: 400,
      msg: 'Bad Request',
    });
  }
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [body.inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectCommentsById = (article_id, limit = 10, page = 1) => {
  const offset = limit * page - limit;
  return db
    .query(
      `SELECT comment_id, votes, created_at,author,body
  FROM comments
  WHERE article_id = $1
  LIMIT $2
  OFFSET $3;
  `,
      [article_id, limit, offset]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertCommentsById = (newComment, article_id) => {
  let formattedData = formatPostCommentsData(newComment, article_id);

  let inputString = format(
    `INSERT INTO comments
 (author, body, article_id)
 VALUES
 %L
 RETURNING author,body,article_id;`,
    formattedData
  );
  return db.query(inputString).then(({ rows }) => {
    return rows[0];
  });
};

exports.doesArticleExist = (article_id) => {
  return db
    .query(`SELECT article_id FROM articles`)
    .then(({ rows }) => {
      let currentArticleIds = [];
      rows.forEach((article) => {
        currentArticleIds.push(article.article_id);
      });
      return currentArticleIds;
    })
    .then((currentArticleIds) => {
      let boolean = currentArticleIds.includes(+article_id);
      return boolean;
    });
};

exports.insertArticle = (article) => {
  const { author, title, body, topic } = article;
  const formattedData = [[author, title, body, topic]];
  if (
    !article.hasOwnProperty('author') ||
    !article.hasOwnProperty('title') ||
    !article.hasOwnProperty('body') ||
    !article.hasOwnProperty('topic')
  ) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }

  let inputString = format(
    `INSERT INTO articles
  (author,title,body,topic)
  VALUES
  %L
  RETURNING *;`,
    formattedData
  );
  return db
    .query(inputString)
    .then(({ rows }) => {
      const article_id = rows[0].article_id;
      return db.query(
        `SELECT articles.article_id, title, articles.body, articles.votes, topic, articles.author, articles.created_at, COUNT(comments.article_id) AS comment_count FROM articles
      LEFT JOIN comments
      ON comments.article_id = articles.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
        [article_id]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeArticleById = (article_id) => {
  return db.query(`DELETE FROM articles WHERE article_id = $1 RETURNING *;`, [
    article_id,
  ]);
};
