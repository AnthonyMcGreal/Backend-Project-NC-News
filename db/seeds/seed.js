const db = require('../connection.js');
const format = require('pg-format');
const {
  formatTopicData,
  formatUserData,
  formatArticleData,
  formatCommentData,
  articleRef,
} = require(`../utils/data-manipulation`);

const seed = async ({ articleData, commentData, topicData, userData }) => {
  await db.query(`DROP TABLE IF EXISTS comments`);
  await db.query(`DROP TABLE IF EXISTS articles`);
  await db.query(`DROP TABLE IF EXISTS users`);
  await db.query(`DROP TABLE IF EXISTS topics`);

  await db.query(`CREATE TABLE topics (
    slug TEXT PRIMARY KEY NOT NULL,
    description TEXT NOT NULL
  );`);

  await db.query(`CREATE TABLE users (
    username VARCHAR(60) PRIMARY KEY NOT NULL,
    avatar_url TEXT,
    name VARCHAR(60) NOT NULL
  );`);

  await db.query(`CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    body TEXT NOT NULL,
    votes INT DEFAULT 0 NOT NULL,
    topic TEXT REFERENCES topics(slug) NOT NULL,
    author VARCHAR(60) REFERENCES users(username),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);

  await db.query(`CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    author VARCHAR(60) REFERENCES users(username) NOT NULL,
    article_id INT REFERENCES articles(article_id) ON DELETE CASCADE NOT NULL,
    votes INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    body TEXT
  );`);

  let insertTopicsData = format(
    `INSERT INTO topics
    (slug, description)
    VALUES %L
    RETURNING *;`,
    formatTopicData(topicData)
  );

  await db.query(insertTopicsData);

  let insertUserData = format(
    `INSERT INTO users
    (username,avatar_url,name)
    VALUES %L
    RETURNING *;`,
    formatUserData(userData)
  );

  await db.query(insertUserData);

  let insertArticlesData = format(
    `INSERT INTO articles
    (title, body, votes, topic, author, created_at)
    VALUES %L
    RETURNING *;`,
    formatArticleData(articleData)
  );

  await db.query(insertArticlesData);

  const newArticleData = await db.query(
    `SELECT article_id, title FROM articles;`
  );

  const articleRefData = await articleRef(
    newArticleData.rows,
    'article_id',
    'title'
  );

  let insertCommentsData = format(
    `INSERT INTO comments
    (author, article_id, votes,created_at, body)
    VALUES %L
    RETURNING *;`,
    formatCommentData(commentData, articleRefData)
  );
  await db.query(insertCommentsData);
};

module.exports.seed = seed;
