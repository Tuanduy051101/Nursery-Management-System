const grade = require('../controllers/grade.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(grade.create)
    .get(grade.findAll)

router.route('/:id')
    .delete(grade.delete)
    .get(grade.find)
    .put(grade.update)
module.exports = router;

