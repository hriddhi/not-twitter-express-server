const express = require('express');
const bodyParser = require('body-parser');

const User = require('../models/users');

var router = express.Router();
router.use(bodyParser.json());

router.post('/', (req, res, next) => {

    if(!req.session.user){
        var authHeader = req.headers.authorization;

        if(!authHeader){
            var err = new Error('Authorization field empty!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err);
        }

        var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        var username = auth[0];
        var password = auth[1];

        User.findOne({username: username})
        .then((user) => {
            if(user === null){
                var err = new Error('User doesn\'t exist!');
                err.status = 403;
                return next(err);
            } else if(user.password !== password){
                var err = new Error('Wrong password!');
                err.status = 403;
                return next(err);
            } else if(user.username === username && user.password === password){
                req.session.user = user.username;
                res.setHeader('Content-Type','text/plain');
                res.end('You are authenticated!');
            }
        }, (err) => next(err))
        .catch((err) => next(err));
    } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are already authenticated!');        
    }
});

module.exports = router;