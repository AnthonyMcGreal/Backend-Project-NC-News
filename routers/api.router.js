const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter.js');
const articleRouter = require('./articleRouter');
const endpoints = require('../endpoints.json');

apiRouter.route('/', getApiInfo());
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articleRouter);

getApiInfo = (req, res, next) => {
  res.status(200).send(endpoints);
};

module.exports = apiRouter;
