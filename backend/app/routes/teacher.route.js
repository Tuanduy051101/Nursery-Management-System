const teacher = require('../controllers/teacher.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(teacher.create)
    .get(teacher.findAll)

router.route('/:id')
    .delete(teacher.delete)
    .get(teacher.find)
    .put(teacher.update)

router.route('/:id/diploma/delete')
    .put(teacher.deleteDiploma)

router.route('/:id/diploma/add')
    .put(teacher.addDiploma)

module.exports = router;

