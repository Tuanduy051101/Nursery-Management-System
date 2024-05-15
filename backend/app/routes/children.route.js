const children = require('../controllers/children.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(children.create)
    .get(children.findAll)

router.route('/:id')
    .delete(children.delete)
    .get(children.find)
    .put(children.update)

router.route('/historyStatus')
    .post(children.create_statusChange)

router.route('/schoolTransferHistory')
    .post(children.transferSchool)
    
module.exports = router;

