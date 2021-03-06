const {
  selectArticles,
  selectArticlesById,
  updateArticleVotesById,
  selectCommentsById,
  insertCommentsById,
  doesArticleExist,
  insertArticle,
  removeArticleById,
} = require('../models/article.models');

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic, limit, page } = req.query;
  selectArticles(sort_by, order, topic, limit, page)
    .then((articles) => {
      return res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticlesById(article_id)
    .then((article) => {
      if (!article) {
        return res.status(404).send({ msg: 'Not Found' });
      } else {
        return res.status(200).send({ article });
      }
    })
    .catch(next);
};

exports.patchArticlesVotesById = (req, res, next) => {
  const { body } = req;
  const { article_id } = req.params;
  updateArticleVotesById(body, article_id)
    .then((article) => {
      if (!article) {
        res.status(404).send({ msg: 'Not Found' });
      } else {
        res.status(200).send({ article });
      }
    })
    .catch(next);
};

exports.getCommentsForArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, page } = req.query;

  doesArticleExist(article_id).then((response) => {
    if (response === false && +article_id > 0) {
      return res.status(404).send('Not Found');
    } else {
      selectCommentsById(article_id, limit, page)
        .then((comments) => {
          res.status(200).send({ comments });
        })
        .catch(next);
    }
  });
};

exports.postCommentsByArticleId = (req, res, next) => {
  const { body } = req;
  const { article_id } = req.params;
  insertCommentsById(body, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  insertArticle(req.body)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.deleteArticlebyId = (req, res, next) => {
  const { article_id } = req.params;

  removeArticleById(article_id)
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Not Found' });
      }
      res.send(204);
    })
    .catch(next);
};
