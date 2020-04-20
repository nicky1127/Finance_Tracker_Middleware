const { Pool } = require('pg');

let pool;

const init = async () => {
  const { PGUSER, PGHOST, PGDATABASE, PGPORT } = process.env;
  console.log('PGUSER',PGUSER,PGHOST,PGDATABASE,PGPORT)
  console.log('Creating pg connection pool');
  pool = new Pool({
    user: PGUSER,
    host: PGHOST,
    database: PGDATABASE,
    port: PGPORT
  });
  console.log('Pool created');
};

const queryInternal = async (text, params, queryPool) => {
  const start = Date.now();
  let failedAuth;
  try {
    const res = await queryPool.query(text, params);
    const duration = Date.now() - start;
    console.log('Excuted query', { text, duration, params, rows: res.rowCount });
    return res;
  } catch (err) {
    const duration = Date.now - start;
    console.error('Error caught while making query', { text, params, duration }, err);
    throw new Error('Error with external resource.');
  }
};

const query = async (text, params) => {
  return queryInternal(text, params, pool);
};

const getClient = async () => {
  console.log('Initialising client...');
  const client = await pool.connect();
  console.log('CLient initialised');
  const originalQuery = client.query.bind(client);
  const originalRelease = client.release;

  client.query = async (text, params) => {
    client.lastQuery = text;
    return queryInternal(text, params, { query: originalQuery });
  };

  const timeout = setTimeout(() => {
    console.error('A client has been checked our for more than 5 seconds!');
    console.error(`The last executed query on this client was : ${client.lastQuery}`);
  }, 5000);

  const release = err => {
    console.log('Releasing client');
    originalRelease(err);
    console.log('Clearing client timeout');
    clearTimeout(timeout);

    console.log('Resetting client query and release to original functions');
    client.query = originalQuery;
    client.release = originalRelease;
  };

  client.release = release;

  return client;
};

module.exports = { init, getClient, query };
