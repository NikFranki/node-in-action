const express = require('express');
const router = express.Router();

const { User, upload } = require('../lib/user');
const user = new User({});

/* user register */
router.post('/register', upload.single("avatar"), user.register);

/* user login */
router.post('/login', user.login);

module.exports = router;