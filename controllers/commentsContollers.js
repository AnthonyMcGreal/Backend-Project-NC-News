const { removeCommentsById } = require('../models/comments.models');

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
