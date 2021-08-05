const express = require("express");
const app = express();
const apiRouter = require("./routers/api.router");

app.use(express.json());

app.use("/", apiRouter);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    console.log(err);
    res.status(500).send();
  }
});

module.exports = app;

// GET /api

// Hoisting

// DELETE /api/comments/:comment_id
// GET /api/users
// GET /api/users/:username
// PATCH /api/comments/:comment_id
