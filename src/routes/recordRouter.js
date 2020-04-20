const express = require('express');

const {
  recordsListByPayer,
  recordCreate,
  recordUpdate,
  recordDelete
} = require('../middlewares/recordMiddleware');

const router = express.Router();

router.get(`/records`, recordsListByPayer, (req, res) => {
  res.status(200).json({ data: req.records });
});

router.post(`/records`, recordCreate, (req, res) => {
  res.status(201).json({ data: { id: req.id } });
});

router.patch(`/records/:recordId`, recordUpdate, (req, res) => {
  res.status(200).json({});
});

router.delete(`/records/:recordId`, recordDelete, (req, res) => {
  res.status(200).json({});
});

module.exports = router;
