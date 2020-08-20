const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const { v4: uuidv4 } = require('uuid');
var multer = require('multer');

const router = express.Router();
router.use(bodyParser.json());

const Posts = require('../models/posts');
const Users = require('../models/users');

const DIR = './public/post/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName);
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

router.route('/')
.get(authenticate.verifyUser, (req, res, next) => {
    Users.findById(req.user._id)
    .then((user) => {
        user.following = user.following.push(req.user._id);
        Posts.find({'userId': user.following})
        .sort({createdAt: -1})
        .populate('user', {username: 1, name: 1, profile_picture: 1})
        .then((post) => {
            res.statusCode = 200;
            res.setHeader('Content-type','application/json');
            res.json(post);
        })
    }, (err) => next(err))
    .catch((err) => next(err));
})  
.post(authenticate.verifyUser, upload.single('image'),  (req, res, next) => {
    console.log(req.body);
    const url = req.protocol + '://' + req.get('host');
    var posts;
    if(req.file === undefined){
        posts = {
            tweet: req.body.tweet,
            userId: mongoose.Types.ObjectId(req.user._id),
            user: mongoose.Types.ObjectId(req.user._id),
            picture: null
        }
    } else {
        posts = {
            tweet: req.body.tweet,
            userId: mongoose.Types.ObjectId(req.user._id),
            user: mongoose.Types.ObjectId(req.user._id),
            picture: url + '/post/' + req.file.filename
        }
    }
    Posts.create(posts)
    .then((post) => {
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
.get(authenticate.verifyUser, (req, res, next) => {
    Posts.findById(req.params.postId)
    .then((post) => {
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.json(post.like);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Posts.findById(req.params.postId)
    .then((post) => {
        console.log(post);
        if(post.like.find((user) => user.userId.equals(req.user._id)) !== undefined){
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

router.route('/comment/:postId')
.get(authenticate.verifyUser, (req, res, next) => {
    Posts.find({repliedTo: req.params.postId})
    .populate('user', {username: 1, name: 1, profile_picture: 1})
    .then((post) => {
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.json(post);
    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(authenticate.verifyUser, (req, res, next) => {
    console.log(req.body);
    Posts.create({
        repliedTo: req.params.postId + '$' + req.body.username,
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
    
module.exports = router;