const endPoints = require('../endpoints.json');

exports.getEndPoints = (req, res, next) => {
  res.status(200).send({ endPoints });
};
