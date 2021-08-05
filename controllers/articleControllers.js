const {
  selectArticles,
  selectArticlesById,
  updateArticleVotesById,
  selectCommentsById,
  insertCommentsById,
} = require('../models/article.models');

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  selectArticles(sort_by, order, topic)
    .then((articles) => {
      return res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticlesById(article_id)
    .then((article) => {
      return res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticlesVotesById = (req, res, next) => {
  const { body } = req;
  const { article_id } = req.params;

  updateArticleVotesById(body, article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getCommentsForArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsById(article_id)
    .then((comments) => {
      if (comments.length === 0) {
        res.status(404).send({ msg: 'Not Found' });
      } else {
        res.status(200).send({ comments });
      }
    })
    .catch(next);
};

exports.postCommentsByArticleId = (req, res, next) => {
  const { body } = req;
  insertCommentsById(body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
