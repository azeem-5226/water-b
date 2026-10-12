const express = require('express');
const router = express.Router();
const { mockData } = require('../data/mockData');

router.get('/', (req, res) => {
  res.json({ services: mockData.services });
});

module.exports = router;
