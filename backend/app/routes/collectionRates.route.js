const collectionRates = require('../controllers/collectionRates.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(collectionRates.create)
    .get(collectionRates.findAll)

router.route('/:id')
    .delete(collectionRates.delete)
    .get(collectionRates.find)
    .put(collectionRates.update)
module.exports = router;

