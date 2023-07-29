const classes = require('../controllers/classes.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(classes.create)
    .get(classes.findAll)

router.route('/:id')
    .delete(classes.delete)
    .get(classes.find)
    .put(classes.update)
module.exports = router;

