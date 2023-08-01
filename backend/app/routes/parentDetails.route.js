const parentDetails = require('../controllers/parentDetails.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(parentDetails.create)
    .get(parentDetails.findAll)

router.route('/:id')
    .delete(parentDetails.delete)
    .get(parentDetails.find)
    .put(parentDetails.update)
module.exports = router;

