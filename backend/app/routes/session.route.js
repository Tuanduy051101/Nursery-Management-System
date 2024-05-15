const session = require('../controllers/session.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(session.create)
    .get(session.findAll)

router.route('/:id')
    .delete(session.delete)
    .get(session.find)
    .put(session.update)
module.exports = router;

