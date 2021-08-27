const express = require('express');
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require('./error-handling');
const app = express();
const apiRouter = require('./routers/api.router');
const cors = require('cors');

app.use(express.json());

app.use('/api', apiRouter);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
