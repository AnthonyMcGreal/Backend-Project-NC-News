const express = require('express');
const app = express();
const apiRouter = require('./routers/api.router');

app.use(express.json());

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === '22P02' || err.code === '42601') {
    res.status(400).send({ msg: 'Bad Request' });
  } else if (err.code === '23503') {
    res.status(404).send({ msg: 'Not Found' });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send();
});

module.exports = app;
