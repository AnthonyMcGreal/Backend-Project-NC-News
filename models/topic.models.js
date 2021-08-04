const db = require("../db/connection");
const format = require("pg-format");

exports.selectTopics = async () => {
  const topics = await db.query(`SELECT * FROM topics`);
  return topics.rows;
};
