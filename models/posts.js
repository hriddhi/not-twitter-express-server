const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId
    },
    username: {
        type: String
    }
}, {
    timestamps: true
});

const postSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    repliedTo: {
        type: String,
        default: null
    },
    tweet: {
        type: String,
        maxlength: 256,
        required: true
    },
    like : [likeSchema]
    }, {
        timestamps: true
});

module.exports = mongoose.model('Post', postSchema);