const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter.js');
const articleRouter = require('./articleRouter.js');
const commentsRouter = require('./commentsRouter');
const usersRouter = require('./usersRouter');
const { getEndPoints } = require('../controllers/apiControllers.js');

apiRouter.route('/').get(getEndPoints);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
