const { removeCommentsById } = require('../models/comments.models');

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentsById(comment_id)
    .then((response) => {
      res.send(204);
    })
    .catch(next);
};
