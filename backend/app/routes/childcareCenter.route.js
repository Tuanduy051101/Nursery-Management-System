const childcareCenter = require('../controllers/childcareCenter.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(childcareCenter.create)
    .get(childcareCenter.findAll)

router.route('/:id')
    .delete(childcareCenter.delete)
    .get(childcareCenter.find)
    .put(childcareCenter.update)
module.exports = router;

