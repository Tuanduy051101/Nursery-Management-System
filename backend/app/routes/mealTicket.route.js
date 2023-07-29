const mealTicket = require('../controllers/mealTicket.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(mealTicket.create)
    .get(mealTicket.findAll)

router.route('/:id')
    .delete(mealTicket.delete)
    .get(mealTicket.find)
module.exports = router;

