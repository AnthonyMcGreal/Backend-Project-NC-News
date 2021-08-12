const {
  removeCommentsById,
  updateCommentsById,
} = require('../models/comments.models');

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentsById(comment_id)
    .then((response) => {
      if (response.rows.length === 0) {
        res.status(404).send('Not Found');
      }
      res.send(204);
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { body } = req;

  updateCommentsById(comment_id, body)
    .then((comment) => {
      if (comment.length === 0) {
        res.status(404).send({ msg: 'Not Found' });
      } else {
        res.status(200).send({ comment });
      }
    })
    .catch(next);
};
