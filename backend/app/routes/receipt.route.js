const receipt = require('../controllers/receipt.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(receipt.create)
    .get(receipt.findAll)

router.route('/:id')
    .delete(receipt.delete)
    .get(receipt.find)
    .put(receipt.update)
module.exports = router;

