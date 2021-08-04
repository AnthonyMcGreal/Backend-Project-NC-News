const commentsRouter = require("express").Router();

commentsRouter.route("/");

// GET /api/articles/:article_id/comments
// POST /api/articles/:article_id/comments
module.exports = commentsRouter;
