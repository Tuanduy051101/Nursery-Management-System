const mail = require('../controllers/mail.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .post(mail.sendMail)

module.exports = router;

