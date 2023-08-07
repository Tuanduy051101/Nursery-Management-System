const tuitionFees = require('../controllers/tuitionFees.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(tuitionFees.create)
    .get(tuitionFees.findAll)

router.route('/:id')
    .delete(tuitionFees.delete)
    .get(tuitionFees.find)
    .put(tuitionFees.update)
module.exports = router;

