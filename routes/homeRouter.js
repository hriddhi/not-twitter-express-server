const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const homeRouter = express.Router();
homeRouter.use(bodyParser.json());

const Posts = require('../models/posts');

homeRouter.route('/')
.get(authenticate.verifyUser, (req, res, next) => {
    Posts.find({})
    .then((post) => {
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.json(post);
    }, (err) => next(err))
    .catch((err) => next(err));
})  
.post(authenticate.verifyUser, (req, res, next) => {
    if(req.body.action === 'post'){
        Posts.create({
            tweet: req.body.tweet,
            userId: mongoose.Types.ObjectId(req.user._id)
        })
        .then((post) => {
            console.log("Post created ", post);
            res.statusCode = 200;
            res.setHeader('Content-type','application/json');
            res.json(post);
        }, (err) => next(err))
        .catch((err) => next(err));
    } else if(req.body.action === 'comment'){
        console.log(req.body);
        Posts.findById(req.body.postId)
        .then((post) => {
            if(post != null){
                post.comments.push({
                    userId: req.user._id,
                    comment: req.body.comment
                });
                post.save()
                .then((post) => {
                    Posts.findById(post._id)
                    .then((post) => {
                        res.statusCode = 200;
                        res.setHeader('Content-type', 'application/json');
                        res.json(post);
                    })
                }, (err) => next(err));
            } else {
                err = new Error('Post not found!');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
    }
})  
.put(authenticate.verifyUser, (req, res, next) => {
    res.end("Editing Posts: " + req.body.comment);
})
.delete(authenticate.verifyUser, (req, res, next) => {
    res.end("Delete operation not allowed on /home");
});
    
module.exports = homeRouter;