const nutritionalIngredient = require('../controllers/nutritionalIngredient.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(nutritionalIngredient.create)
    .get(nutritionalIngredient.findAll)

router.route('/:id')
    .delete(nutritionalIngredient.delete)
    .get(nutritionalIngredient.find)
module.exports = router;

