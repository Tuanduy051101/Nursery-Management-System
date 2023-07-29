const duty = require('../controllers/duty.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(duty.create)
    .get(duty.findAll)

router.route('/:id')
    .delete(duty.delete)
    .get(duty.find)
module.exports = router;

