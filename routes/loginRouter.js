const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const User = require('../models/users');
const authenticate = require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());

router.post('/', passport.authenticate('local') ,(req, res) => {
    //console.log(req);
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.json({success: true, token: token, user: req.user});
});

module.exports = router;