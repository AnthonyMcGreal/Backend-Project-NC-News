const db = require("../db/connection");
const format = require("pg-format");

exports.selectTopics = async () => {
  const topics = await db.query(`SELECT * FROM topics`);
  console.log(topics.rows);
  return topics.rows;
};
