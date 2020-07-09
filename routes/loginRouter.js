const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const User = require('../models/users');

var router = express.Router();
router.use(bodyParser.json());

router.post('/', passport.authenticate('local') ,(req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You have successfully logged in!');        
});

module.exports = router;