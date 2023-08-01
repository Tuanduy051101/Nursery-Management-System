const classes = require('../controllers/classes.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(classes.create)
    .get(classes.findAll)

router.route('/create-auto')
    .post(classes.createAuto)

router.route('/:id/children-none-class')
    .get(classes.children_noneClass)

router.route('/:id')
    .delete(classes.delete)
    .get(classes.find)
    .put(classes.update)

router.route('/:id/add-child-one')
    .put(classes.addChild_one)

router.route('/:id/add-child-many')
    .put(classes.addChild_many)

router.route('/:id/add-child-auto')
    .put(classes.addChild_auto)

router.route('/:id/remove-child')
    .put(classes.removeChild)

router.route('/:id/remove-child-many')
    .put(classes.removeChild_many)
module.exports = router;

