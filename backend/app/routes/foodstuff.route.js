const foodstuff = require('../controllers/foodstuff.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(foodstuff.create)
    .get(foodstuff.findAll)

router.route('/:id')
    .delete(foodstuff.delete)
    .get(foodstuff.find)
module.exports = router;

