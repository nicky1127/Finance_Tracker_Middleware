require('dotenv-flow').config();
require('express-async-errors');
const express = require('express');
const moment = require('moment');
const bodyParser = require('body-parser');
const cors = require('cors');
const createError = require('http-errors');

const pgClient = require('./configuration/pgClient');
const recordRouter = require('./routes/recordRouter');

const app = express();

let server;
const name = 'finance-recorder';
const port = process.env.PORT || 5000;

const apiBase = '/api';

function log() {
  const args = [...arguments];
  const dt = moment().format('YYYY-MM-DD HH:mm:ss');
  args.unshift(`[${dt}]`);
  console.log(...args);
}

/* CORS */
app.use(cors({ origin: true }));

/* Body Parser */
app.use(bodyParser.json());

/* Routers */
app.use(apiBase, recordRouter);

/* Catch 404 and forward to error handler */
app.use((req, res, next) => {
  next(createError(404));
});

/* Error Handler */
app.use((err, req, res, next) => {
  console.error('Caught by error handler', err);
  req.error = err;
  if (err.expose === undefined) {
    const httpErr = createError(500);
    res.status(httpErr.status).json({ error: httpErr.message });
  } else {
    res.status(err.status).json({ error: err.message });
  }
});

log('process.env.NODE_ENV: ', process.env.NODE_ENV);

const setUpClients = async () => {
  await pgClient.init();
  server = app.listen(port, () => log(`${name} listening on port ${port}`));
};

setUpClients().catch(err => console.error('Failed to run Postgres.', err));
