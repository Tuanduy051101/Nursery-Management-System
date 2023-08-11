const position = require('../controllers/position.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(position.create)
    .get(position.findAll)

router.route('/:id')
    .delete(position.delete)
    .get(position.find)
    .put(position.update)
module.exports = router;

