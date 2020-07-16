const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Posts = require('../models/posts');
const Users = require('../models/users');

const profileRouter = express.Router();
profileRouter.use(bodyParser.json());

profileRouter.route('/:username')
.get(authenticate.verifyUser, (req, res, next) => {
    Users.findOne({username: req.params.username})
    .then((user) => {
        console.log(user._id);
        Posts.find({userId: user._id})
        .then((post) => {
            res.statusCode = 200;
            res.setHeader('Content-type','application/json');
            res.json({
                user: user,
                data: post
            });
        })
    }, (err) => next(err))
    .catch((err) => next(err));
})  
.post(authenticate.verifyUser, (req, res, next) => {
    
})  
.put(authenticate.verifyUser, (req, res, next) => {
    res.end("Editing Posts: " + req.body.comment);
})
.delete(authenticate.verifyUser, (req, res, next) => {
    res.end("Delete operation not allowed on /home");
});

    
module.exports = profileRouter;