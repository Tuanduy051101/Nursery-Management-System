const evaluate = require('../controllers/evaluate.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .get(evaluate.findAll)

router.route('/:id')
    .delete(evaluate.delete)
    .get(evaluate.find)
    .put(evaluate.update)
module.exports = router;

