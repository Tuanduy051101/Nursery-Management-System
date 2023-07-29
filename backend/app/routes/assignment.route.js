const diploma = require('../controllers/assignment.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(diploma.create)
    .get(diploma.findAll)

router.route('/:id')
    .delete(diploma.delete)
    .get(diploma.find)
module.exports = router;

