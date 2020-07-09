const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const User = require('../models/users');

var router = express.Router();
router.use(bodyParser.json());

router.post('/', (req, res, next) => {

    User.register(new User({
        username: req.body.username,
        name: req.body.name,
        dob: req.body.dob
    }), req.body.password, (err, user) => {
        if(err){
            res.statusCode = 500;
            res.setHeader('Content-type', 'application/json');
            res.json({err: err});
        } else {
            passport.authenticate('local')(req, res, () => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json({
                    status: 'Registration successful',
                    success: true,
                    user: user
                });
            });
        }
    });
});

module.exports = router;