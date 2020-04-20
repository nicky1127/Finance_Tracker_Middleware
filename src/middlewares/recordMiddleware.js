const createError = require('http-errors');
const uuid = require('uuid');
const db = require('../configuration/pgClient');

const ERROR_GETTING_RECORDS = 'Error getting records';
const ERROR_CREATING_RECORD = 'Error creating record';
const ERROR_UPDATING_RECORD = 'Error updating record';
const ERROR_DELETING_RECORD = 'Error deleting record';

const SELECT_RECORDS_BY_PAYER = 'SELECT * FROM records WHERE payer = $1 ;';
const INSERT_RECORD =
  'INSERT INTO records (id, title, date, price , paid , payer) Values ($1, $2,$3, $4, $5, $6);';
const UPDATE_RECORD =
  'UPDATE records SET title=$1, date=$2, price=$3 , paid=$4 , payer=$5 WHERE id =$6';
const DELETE_RECORD = 'DELETE FROM records WHERE id = $1';

const recordsListByPayer = async (req, res, next) => {
  console.log('Getting all records by payer');
  const { payer } = req.query;
  const result = await db.query(SELECT_RECORDS_BY_PAYER, [payer]).catch(err => {
    throw createError(500, ERROR_GETTING_RECORDS);
  });
  // setTimeout(()=>res.json({ data: recordsObj }), 1000);
  // throw createError(404, `Failed to laod records related to ${payer}`);

  req.records = result.rows;
  next();
};

const promiseTimeout = delay =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject();
    }, delay);
  });

const recordCreate = async (req, res, next) => {
  console.log('Creating a record');
  const record = req.body.data;
  const id = uuid.v1();
  await db
    .query(INSERT_RECORD, [
      id,
      record.title,
      record.date,
      record.price,
      record.isPaid,
      record.payer
    ])
    .catch(err => {
      throw createError(500, ERROR_CREATING_RECORD);
    });
  //   await promiseTimeout(1000).catch(()=>{throw createError(404, `Failed to add record related to ${record.payer}`)});
  // throw createError(404, `Failed to add record related to ${record.payer}`);

  //   setTimeout(() => res.json({ data: record.id }), 2000);
  req.id = id;
  next();
};

const recordUpdate = async (req, res, next) => {
  //   throw createError(404, `Failed to update record related to`);
  //   setTimeout(() => res.json({ data: records[idx].id }), 1000);
  // res.json({ data: records[idx].id });
  console.log('Updating a record');
  const record = req.body.data;
  const { recordId } = req.params;
  await db
    .query(UPDATE_RECORD, [
      record.title,
      record.date,
      record.price,
      record.isPaid,
      record.payer,
      recordId
    ])
    .catch(err => {
      throw createError(500, ERROR_UPDATING_RECORD);
    });

  next();
};

const recordDelete = async (req, res, next) => {
  //   throw createError(404, `Failed to delete the record`);
  console.log('Deleting a record');
  const { recordId } = req.params;
  await db.query(DELETE_RECORD, [recordId]).catch(err => {
    throw createError(500, ERROR_DELETING_RECORD);
  });

  next();
};

module.exports = { recordsListByPayer, recordCreate, recordUpdate, recordDelete };
