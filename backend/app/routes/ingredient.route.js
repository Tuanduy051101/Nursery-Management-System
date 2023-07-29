const ingredient = require('../controllers/ingredient.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(ingredient.create)
    .get(ingredient.findAll)

router.route('/:id')
    .delete(ingredient.delete)
    .get(ingredient.find)
module.exports = router;

