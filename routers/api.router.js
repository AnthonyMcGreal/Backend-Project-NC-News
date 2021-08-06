const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter.js');
const articleRouter = require('./articleRouter.js');
const { getEndPoints } = require('../controllers/apiControllers.js');

apiRouter.route('/').get(getEndPoints);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articleRouter);

module.exports = apiRouter;
