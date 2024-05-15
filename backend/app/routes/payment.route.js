const payment = require('../controllers/payment.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(payment.create)
    .get(payment.findAll)

router.route('/:id')
    .delete(payment.delete)
    .get(payment.find)
module.exports = router;

