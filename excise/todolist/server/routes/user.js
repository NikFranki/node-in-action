const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../lib/user');
const user = new User({});

/* user register */
router.post('/register', user.register);

/* user login */
router.post('/login', user.login);

module.exports = router;