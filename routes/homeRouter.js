const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const homeRouter = express.Router();
homeRouter.use(bodyParser.json());

const Posts = require('../models/posts');

homeRouter.route('/')
.get((req, res, next) => {
    Posts.find({})
    .then((post) => {
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.json(post);
    }, (err) => next(err))
    .catch((err) => next(err));
})  
.post((req, res, next) => {
    Posts.create(req.body)
    .then((post) => {
        console.log("Post created ", post);
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.json(post);
    }, (err) => next(err))
    .catch((err) => next(err));
})  
.put((req, res, next) => {
    res.end("Editing Posts: " + req.body.comment);
})
.delete((req, res, next) => {
    res.end("Delete operation not allowed on /home");
});
    
module.exports = homeRouter;