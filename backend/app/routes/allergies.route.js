const allergies = require('../controllers/allergies.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(allergies.create)
    .get(allergies.findAll)

router.route('/:id')
    .delete(allergies.delete)
    .get(allergies.find)
    .put(allergies.update)

router.route('/allergen')
    .get(allergies.findAllAllergen)
module.exports = router;

