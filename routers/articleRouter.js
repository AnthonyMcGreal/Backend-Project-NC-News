const articleRouter = require('express').Router();
const {
  getArticles,
  getArticlesById,
  patchArticlesVotesById,
  getCommentsForArticleId,
  postCommentsByArticleId,
  postArticle,
  deleteArticlebyId,
} = require('../controllers/articleControllers');

articleRouter.route('/').get(getArticles).post(postArticle);

articleRouter
  .route('/:article_id')
  .get(getArticlesById)
  .patch(patchArticlesVotesById)
  .delete(deleteArticlebyId);

articleRouter
  .route('/:article_id/comments')
  .get(getCommentsForArticleId)
  .post(postCommentsByArticleId);

module.exports = articleRouter;
