const month = require('../controllers/month.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(month.create)
    .get(month.findAll)

router.route('/:id')
    .get(month.find)

module.exports = router;

