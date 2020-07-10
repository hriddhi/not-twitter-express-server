const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    comment: {
        type: String,
        maxlength: 256,
        required: true
    }
}, {
    timestamps: true
});

const postSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    tweet: {
        type: String,
        maxlength: 256,
        required: true
    },
    comments: [commentSchema]
    }, {
        timestamps: true
});

module.exports = mongoose.model('Post', postSchema);