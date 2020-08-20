const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        maxlength: 50,
        default: ''
    },
    name: {
        type: String,
        maxlength: 50,
        required: true
    },
    profile_picture: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    },
    location: {
        type: String,
        default: null
    },
    dob: {
        type: String,
        required: true
    },
    link: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        maxlength: 256,
        default: null
    },
    joined: {
        type: Date,
    },
    following: {
        type: [mongoose.Types.ObjectId],
    },
    followers: {
        type: [mongoose.Types.ObjectId],
    },
    tweet_id: {
        type: [mongoose.Types.ObjectId],
    },
    liked_id: {
        type: [mongoose.Types.ObjectId],
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);