const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: Date,
    ref: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    comment: String
})

const Comment = mongoose.model('comment', commentSchema);
module.exports = Comment;