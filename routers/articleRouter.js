const articleRouter = require("express").Router();
const {
  getArticles,
  getArticlesById,
  patchArticlesVotesById,
} = require("../controllers/articleControllers");
const { commentsRouter } = require("./commentsRouter");

articleRouter.route("/").get(getArticles);

articleRouter
  .route("/:article_id")
  .get(getArticlesById)
  .patch(patchArticlesVotesById);
//.get
//articleRouter.use("/comments", commentsRouter);

module.exports = articleRouter;

//Endpoints required

// GET /api/articles
