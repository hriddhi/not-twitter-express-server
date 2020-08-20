const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
var multer  = require('multer');
const { v4: uuidv4 } = require('uuid');

const User = require('../models/users');

var router = express.Router();
router.use(bodyParser.json());

const DIR = './public/profile/';

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

router.post('/', upload.single('image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    User.register(new User({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        dob: req.body.dob,
        location: req.body.location,
        bio: req.body.bio,
        joined: new Date(),
        profile_picture: url + '/profile/' + req.file.filename
    }), req.body.password, (err, user) => {
        if(err){
            console.log(err);
            res.statusCode = 500;
            res.setHeader('Content-type', 'application/json');
            res.json({err: err});
        } else {
            passport.authenticate('local')(req, res, () => {
                console.log(user);
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