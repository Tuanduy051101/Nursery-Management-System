const dish = require('../controllers/dish.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(dish.create)
    .get(dish.findAll)

router.route('/:id')
    .delete(dish.delete)
    .get(dish.find)
    .put(dish.update)
module.exports = router;

