const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validSortBy = ["created_at", "author"];
  const validOrders = ["asc", "desc"];

  if (!validSortBy.includes(sort_by) || !validOrders.includes(order)) {
    return Promise.reject({ status: 404, msg: "Bad Request" });
  }

  const queryValues = [];
  let queryStr = `SELECT * FROM articles`;

  if (topic) {
    queryStr += ` WHERE topic = $1`;
    queryValues.push(topic);
  }

  queryStr += ` ORDER BY ${sort_by} ${order.toUpperCase()};`;

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
