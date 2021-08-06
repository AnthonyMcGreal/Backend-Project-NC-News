const commentsRouter = require('express').Router();
const { deleteCommentById } = require('../controllers/commentsContollers');

commentsRouter.route('/');
commentsRouter.route('/:comment_id').delete(deleteCommentById);

module.exports = commentsRouter;
