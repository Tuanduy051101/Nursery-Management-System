const meal = require('../controllers/meal.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(meal.create)
    .get(meal.findAll)

router.route('/:id')
    .delete(meal.delete)
    .get(meal.find)
module.exports = router;

