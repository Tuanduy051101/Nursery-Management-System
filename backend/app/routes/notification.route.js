const notification = require('../controllers/notification.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(notification.create)
    .get(notification.findAll)

router.route('/:id')
    .delete(notification.delete)
    .get(notification.find)
    .put(notification.update)
module.exports = router;

