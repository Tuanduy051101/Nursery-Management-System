const allergen = require('../controllers/allergen.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(allergen.create)
    .get(allergen.findAll)

router.route('/:id')
    .delete(allergen.delete)
    .get(allergen.find)
    .put(allergen.update)

module.exports = router;

