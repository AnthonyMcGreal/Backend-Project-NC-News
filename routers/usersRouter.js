const usersRouter = require('express').Router();
//controllers
const {
  getUsers,
  getUserByUsername,
} = require('../controllers/usersControllers');

usersRouter.route('/').get(getUsers);
usersRouter.route('/:username').get(getUserByUsername);

module.exports = usersRouter;
