const attendance = require('../controllers/attendance.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(attendance.create)
    .get(attendance.findAll)

router.route('/abc')
    .post(attendance.checkUpdate)

router.route('/:id')
    .delete(attendance.delete)
    .get(attendance.find)
    .put(attendance.update)
module.exports = router;

