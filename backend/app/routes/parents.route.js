const parents = require('../controllers/parents.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(parents.create)
    .get(parents.findAll)

router.route('/:id')
    .delete(parents.delete)
    .get(parents.find)
module.exports = router;

