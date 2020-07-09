const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
    tweet_id: {
        type: [
            new Schema({
                tweet_id: {
                    type: String,
                }
            })
        ],
    },
    commented_id: {
        type: [
            new Schema({
                tweet_id: {
                    type: String,
                }
            })
        ],
    },
    liked_id: {
        type: [
            new Schema({
                tweet_id: {
                    type: String,
                }
            })
        ],
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);