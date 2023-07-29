const cdi = require('../controllers/cdi.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(cdi.create)
    .get(cdi.findAll)

router.route('/:id')
    .delete(cdi.delete)
    .get(cdi.find)
    .put(cdi.update)
module.exports = router;

