const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const router = express.Router();
router.use(bodyParser.json());

const Posts = require('../models/posts');
const Users = require('../models/users');

router.route('/:postId')
.get(authenticate.verifyUser, (req, res, next) => {
    console.log(req.params.postId);
    Posts.findOne({_id: req.params.postId.split('$')[0]})
    .populate('user', {username: 1, name: 1, profile_picture: 1})
    .then((post) => {
        Posts.find({repliedTo: post._id+'$'+post.user.username})
        .populate('user', {username: 1, name: 1, profile_picture: 1})
        .then((comments) => {
            res.statusCode = 200;
            res.setHeader('Content-type','application/json');
            res.json({post: {
                _id: post._id,
                createdAt: post.createdAt,
                like: post.like,
                repliedTo: post.repliedTo,
                tweet: post.tweet,
                picture: post.picture,
                user: post.user,
                userId: post.userId
            }, comment: comments, like_count: post.like.length});
        }, (err) => next(err))
        .catch((err) => next(err))
    })
    .catch((err) => next(err))
});

router.route('/comment/:postId')
.post(authenticate.verifyUser, (req, res, next) => {
    console.log(req.body);
    Posts.create({
        repliedTo: req.params.postId,
        tweet: req.body.comment,
        userId: mongoose.Types.ObjectId(req.user._id),
        user: mongoose.Types.ObjectId(req.user._id)
    })
    .then((post) =>{
        Posts.findById(post._id)
        .populate('user', {username: 1, name: 1, profile_picture: 1})
        .then((post) => {
            console.log(post);
            res.statusCode = 200;
            res.setHeader('Content-type','application/json');
            res.json(post);
        }, (err) => next(err))
    }, (err) => next(err))
    .catch((err) => next(err))
});

router.route('/like/:postId')
.post(authenticate.verifyUser, (req, res, next) => {
    Posts.findById(req.params.postId)
    .then((post) => {
        console.log(post);
        if(post.like.find((user) => user.userId.equals(req.user._id) !== undefined)){
            post.like.splice(post.like.findIndex((user) => user.userId.equals(req.user._id)), 1);
            post.save()
            .then((post) => {
                Users.findById(req.user._id)
                .then((user) => {
                    user.liked_id.pull(req.params.postId);
                    user.save()
                    .then((user) => {
                        console.log(post.like);
                        res.statusCode = 200;
                        res.setHeader('Content-type','application/json');
                        res.json(post.like);
                    }, (err) => next(err))
                }, (err) => next(err))
            }, (err) => next(err))
        } else {
            post.like.push({userId: req.user._id, username: req.user.username});
            post.save()
            .then((post) => {
                Users.findById(req.user._id)
                .then((user) => {
                    user.liked_id.push(req.params.postId);
                    user.save()
                    .then((user) => {
                        console.log(post.like);
                        res.statusCode = 200;
                        res.setHeader('Content-type','application/json');
                        res.json(post.like);
                    }, (err) => next(err))
                }, (err) => next(err))
            }, (err) => next(err))
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
    
module.exports = router;