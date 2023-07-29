const nutritional = require('../controllers/nutritional.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(nutritional.create)
    .get(nutritional.findAll)

router.route('/:id')
    .delete(nutritional.delete)
    .get(nutritional.find)
module.exports = router;

