const schoolYear = require('../controllers/schoolYear.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(schoolYear.create)
    .get(schoolYear.findAll)

router.route('/:id')
    .delete(schoolYear.delete)
    .get(schoolYear.find)
module.exports = router;

