const paymentDetail = require('../controllers/paymentDetail.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(paymentDetail.create)
    .get(paymentDetail.findAll)

router.route('/:id')
    .delete(paymentDetail.delete)
    .get(paymentDetail.find)
    .put(paymentDetail.update)
module.exports = router;

