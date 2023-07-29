const account = require('../controllers/account.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(account.create)
    .get(account.findAll)

router.route('/signin')
    .post(account.signin)

router.route('/:id')
    .delete(account.delete)
    .get(account.find)
module.exports = router;

