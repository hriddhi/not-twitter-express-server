const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const router = express.Router();
router.use(bodyParser.json());

const Posts = require('../models/posts');
const Users = require('../models/users');

router.route('/')
.post(authenticate.verifyUser, (req, res, next) => {
  Users.find({_id: req.body.user})
  .select({_id: 1, name: 1, username: 1, profile_picture: 1})
  .then((user) => {
    console.log(user);
    res.statusCode = 200;
    res.setHeader('Content-type','application/json');
    res.json(user);
  }, (err) => next(err))
  .catch((err) => next(err))
});

router.route('/follows/:follow')
.post(authenticate.verifyUser, (req, res, next) => {
  //console.log(req.params.postId);
  Users.findById(req.user._id)
  .then((user) => {
    var following = user.following.filter((val) => !val.equals(req.params.follow));
    if(following.length === user.following.length)
      user.following.push(req.params.follow);
    else
      user.following = following;
    user.save()
    .then((users) => {
      Users.findById(req.params.follow)
      .then((user1) => {
        var followers = user1.followers.filter((val) => !val.equals(req.user._id))
        console.log(followers.length === user1.followers.length);
        if(followers.length === user1.followers.length){
          user1.followers.push(req.user._id);
          console.log("if - " + user1.followers);
        } else {
          user1.followers = followers;
          console.log("else - " + user1.followers);
        }
        user1.save()
        .then((_user) => {
          console.log(_user.followers);
          res.statusCode = 200;
          res.setHeader('Content-type','application/json');
          res.json(_user.followers);
        }, (err) => next(err))
      }, (err) => next(err))
    }, (err) => next(err))
  }, (err) => next(err))
  .catch((err) => next(err))
});

router.route('/find')
.get(authenticate.verifyUser, (req, res, next) => {
  Users.find({_id: req.user.following})
  .then((user) => {
    console.log(user);
    var all = [];
    user.forEach(element => {
      all = all.concat(element.following);
    });
    console.log(all);
    var unique = [];
    all.forEach(element => {
      if(!req.user.following.includes(element) && !unique.includes(element)) {
        unique.push(element);
      }
    })
    console.log(unique);
    Users.find({_id: unique})
    .select({_id: 1, name: 1, username: 1, profile_picture: 1})
    .then((users) => {
      console.log(users);
      res.statusCode = 200;
      res.setHeader('Content-type','application/json');
      res.json(users);
    }, (err) => next(err))
  }, (err) => next(err))
  .catch((err) => next(err));
})

module.exports = router;