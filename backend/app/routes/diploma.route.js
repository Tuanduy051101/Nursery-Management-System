const diploma = require('../controllers/diploma.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(diploma.create)
    .get(diploma.findAll)

router.route('/:id')
    .delete(diploma.delete)
    .get(diploma.find)
    .put(diploma.update)
module.exports = router;

