const articleRouter = require("express").Router();
const {
  getArticles,
  getArticlesById,
  patchArticlesVotesById,
  getCommentsForArticleId,
  postCommentsByArticleId,
} = require("../controllers/articleControllers");
const { commentsRouter } = require("./commentsRouter");

articleRouter.route("/").get(getArticles);

articleRouter
  .route("/:article_id")
  .get(getArticlesById)
  .patch(patchArticlesVotesById);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsForArticleId)
  .post(postCommentsByArticleId);

module.exports = articleRouter;

//Endpoints required

// GET /api/articles
