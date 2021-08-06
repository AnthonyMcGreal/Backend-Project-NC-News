const articleRouter = require('express').Router();
const {
  getArticles,
  getArticlesById,
  patchArticlesVotesById,
  getCommentsForArticleId,
  postCommentsByArticleId,
} = require('../controllers/articleControllers');

articleRouter.route('/').get(getArticles);

articleRouter
  .route('/:article_id')
  .get(getArticlesById)
  .patch(patchArticlesVotesById);

articleRouter
  .route('/:article_id/comments')
  .get(getCommentsForArticleId)
  .post(postCommentsByArticleId);

module.exports = articleRouter;
