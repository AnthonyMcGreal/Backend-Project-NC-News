const { selectUsers, selectUserByUsername } = require('../models/users.models');

exports.getUsers = (req, res, next) => {
  selectUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username)
    .then((user) => {
      if (user.length === 0) {
        res.status(404).send({ msg: 'Not Found' });
      } else {
        res.status(200).send({ user });
      }
    })
    .catch(next);
};
