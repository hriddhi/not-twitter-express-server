const express = require('express');
const bodyParser = require('body-parser');

const User = require('../models/users');

var router = express.Router();
router.use(bodyParser.json());

router.post('/', (req, res, next) => {

    User.findOne({username: req.body.username})
    .then((user) => {
        if(user != null){
            console.log('User already exist!');
            var err = new Error('User already exist!');
            err.status = 403;
            // next(err);
            throw err;            
        } else {
            return User.create({
                username: req.body.username,
                password: req.body.password,
                name: req.body.name,
                dob: req.body.dob
            });
        }
    })
    .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({
            status: 'Registration successful',
            user: user
        });
    }, (err) => next(err))
    .catch((err) => next(err));

});

module.exports = router;